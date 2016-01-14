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

module.exports = function(app, passport) {

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
 			if(err) { res.end("Db error"); }
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
            return res.end("Error uploading file.");
        }
        
        if(req.file == undefined) return res.end("Meep. Empty file.");

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
          fs.unlink(req.file.path, function (err) {  } );
        });

        // create a new model entry
        var myModel = new Model();
        myModel.ownerId = req.user.id;
        myModel.name = req.file.originalname;
        myModel.fileLocation = req.file.path.replace("uploads/","");
        myModel.deflateLocation = extractionPath;
        myModel.fileSize = req.file.size;
        myModel.formatedFileSize = getBytesWithUnit(req.file.size);
        myModel.dateAdded = getFormatedDate();
        myModel.urlId = shortid.generate();

        // save the file in our db.
        myModel.save(function(err){
        	if(err) return res.end("Db error");
        });

        // update user quota.
        User.findOne({auth0id : req.user.id}, function(err, user) {
        	user.usedStorage += req.file.size;
        	user.save();
          res.end();
        });

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
};

// *****************************************************
//	HELPER FUNC
// *****************************************************

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
	var maxStorage = 1073741824;
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


