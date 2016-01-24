var Model = require('../app/models/models');
var User = require('../app/models/user');
var DecompressZip = require('decompress-zip');
var shortid = require('shortid');
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);


// *****************************************************
//	MULTER UPLOAD STUFF
// *****************************************************


var multer  = require('multer');
var storage = multer.diskStorage({
	destination : function(req, file, callback) {
		callback(null, './uploads');
	}, 
	filename : function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + '-' + req.user.id);
	}
});
var upload = multer( { storage : storage} ).single('userModel');

// *****************************************************
//	ROUTING
// *****************************************************

module.exports = function(app, passport, express) {

	// *****************************************************
	//	MAIN VIEWS
	// *****************************************************
	
	/**
	 * Homepage route
	 */
	app.get("/", function(req, res) {
	 	res.render("index.jade",  {
	 		loggedIn : req.isAuthenticated(),
      username : req.user != null ? req.user.nickname : "Anon"
	 	});
	});

	/**
	 *  User Profile
	 */
	app.get("/profile", isLoggedIn, function(req, res){
	 	Model.findOwnerModels(req.user.id, function(err, models){
 			//if(err) { res.end("Db error"); }
 			res.render("profile.jade", {
	 			data : {
	 				user : req.user,
	 				userTier : req.myUser.tier,
	 				usedStorage : getBytesWithUnit(req.myUser.usedStorage),
	 				usedStoragePerc : getQouta(req.myUser.usedStorage),
	 				userModels : models.reverse(),
          firstVisit : req.firstVisit
	 			}
	 		})		
	 	});	 	
	});

  // *****************************************************
	//	AUTH
	// *****************************************************

	/**
	 *  Passport Auth0
	 */	 
	app.get("/callback", passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  	function(req, res) {
		  if (!req.user) {
	      throw new Error('user null');
	    }
	    
      User.saveUnique(req.user, function(save) {
	    	if(save) {
          var myUser = new User();
          myUser.auth0id = req.user.id;
          myUser.username = req.user.nickname;
          myUser.tier = "Amazing Alpha Tester";
          myUser.usedStorage = 0;
          myUser.save();

          // add stuff to req, needed
          req.myUser = myUser;
          req.firstVisit = true;
          console.log("setting first visit to TRUE from callback");
        }
        else {
          req.myUser = myUser;
          req.firstVisit = false;
          console.log("setting first visit to false from callback");
        }
	      res.redirect("/profile");        
	    });
      
  });

	/**
	 * Logout 
	 */
	app.get("/logout", function(req, res) {
	 	req.logout();
	 	res.redirect("/");
	});

	// *****************************************************
	//	MODELS API
	// *****************************************************

	/**
	 * Upload
	 */
	app.post("/api/upload", isLoggedIn, function(req, res){
	 		upload(req, res, function(err) {
        
        if(err) {
          console.log("ERR_UPLOAD: Upload Err");
          return res.end("Error uploading file.");
        }
        
        if(req.file == undefined) {
          console.log("ERR_UPLOAD: req.file is undefined");
          return res.end("Meep. Empty file.");
        }

        var unzipper = new DecompressZip(req.file.path);      
        var extractionPath = "./uploads/" + req.file.path.replace("uploads", "deflated");
        
        unzipper.extract({
          path: extractionPath
        });

        unzipper.on('progress', function (fileIndex, fileCount) {
          //console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
        });

        unzipper.on('extract', function (log) {
          // delete the original upload after we have extracted stuff
          fs.unlink(req.file.path, function (err) { console.log("ERR_UPLOAD: failed to delete original zip") } );
        });

        // create a new model entry
        var myModel = new Model();
        var name = req.file.originalname.split(".");
        myModel.ownerId = req.user.id;
        myModel.name = name[0];
        myModel.fileLocation = req.file.path.replace("uploads/","");
        myModel.deflateLocation = extractionPath;
        myModel.fileSize = req.file.size;
        myModel.formatedFileSize = getBytesWithUnit(req.file.size);
        myModel.dateAdded = getFormatedDate();
        myModel.urlId = shortid.generate();

        // save the file in our db.
        myModel.save(function(err){
        	if(err) {
            console.log("ERR_UPLOAD: Failed to save model");
            return res.end("Db error");
          }
        });

        // update user quota.
        User.findOne({auth0id : req.user.id}, function(err, user) {
        	user.usedStorage += req.file.size;
        	user.save();
        });

        // release the dragon
        res.json({ok: "ok"});
        //res.end();

    });
	});

	/**
	 *  Delete
	 */
	app.get("/api/delete/:id", isLoggedIn, function(req, res){
	 	console.log(req.params.id);
	 	Model.deleteModel(req.params.id, req.user.id, function(fileSize) {
	 		User.findOne({auth0id : req.user.id}, function(err, user) {
          user.usedStorage -= fileSize;
          user.save();
          res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
          res.redirect("/profile");
        });
	 	});
	});

  // *****************************************************
  //  VIEWER ROUTES
  // *****************************************************

  /**
   * Main viewer route
   */
  
  app.get("/view/*", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/modelviewer/index.html");
  });

  /**
   * Get model part
   * GET requests seem to be cached, so here's hoping for the best
   * Maybe this is an overkill, but it does add a layer of security
   * TODO: get a profesional developer
   */
  
  app.get("/api/model/", isAuthorized, function (req, res) {
    var modelName = req.param("mn");
    var modelKey = req.param("mk");
    
    Model.findOne({urlId: modelName}, function(err, myModel) {
      if(err) { 
        // DB error
        res.send("Database Error."); 
      }
      else if (myModel === null) {
        // No model by that name
        res.send("Couldn't find any model. Soz!"); 
      } else {
        // We're almost good to go

        // This is the initial request from the viewer, and we send the url to params.json and static.json
        var response = { 
          paramsFile : myModel.deflateLocation + "/" + myModel.name + "/params.json",
          staticGeoFile : myModel.deflateLocation + "/" + myModel.name + "/static.json",
          modelName : myModel.name,
          dateAdded : myModel.dateAdded
        }

        res.json(response);

      }
    })
  // end of the get route; what a xmas tree in there, man
  }); 

  /**
   * END OF MODULE.EXPORTS
   */
};

// *****************************************************
//	HELPER FUNC / probably should go into controllers, this file is getting unwieldly.
// *****************************************************

function isAuthorized(req, res, next) {
  // for now everything is authorized - YAY
  return next();
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		User.findOne({auth0id : req.user.id}, function(err, user){
			if(err) res.redirect("/");
			req.myUser = user;
      if(req.firstVisit === null) { req.firstVisit = false; console.log("setting first visit to false from isloggedin"); } else {req.firstVisit = true;}
			return next();
		});
	} else 
		res.redirect("/");
}

function getBytesWithUnit( bytes ) {
  if( isNaN( bytes ) ){ return; }
  var units = [ ' bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB' ];
  var amountOf2s = Math.floor( Math.log( +bytes )/Math.log(2) );
  if( amountOf2s < 1 ){
    amountOf2s = 0;
  }
  var i = Math.floor( amountOf2s / 10 );
  bytes = +bytes / Math.pow( 2, 10*i );
 
  // Rounds to 3 decimals places.
        if( bytes.toString().length > bytes.toFixed(3).toString().length ){
            bytes = bytes.toFixed(2);
        }
  return bytes + units[i];
}

function getQouta(usedStorage)
{
	var maxStorage = 1073741824; // 1 GB
	return (usedStorage/maxStorage * 100);
}

function getFormatedDate()
{
  var date = new Date();

  var year = date.getUTCFullYear();
  var month = date.getUTCMonth();
  var day = date.getUTCDate();

  //month 2 digits
  month = ("0" + (month + 1)).slice(-2);

  //year 2 digits
  year = year.toString().substr(2,2);

  var formattedDate = day + '/' + month + "/" + year;

  return formattedDate;
}