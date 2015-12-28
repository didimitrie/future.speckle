var Model = require('../app/models/models');
var multer  = require('multer');

var storage = multer.diskStorage({
	destination : function(req, file, callback) {
		callback(null, './uploads');
	}, 
	filename : function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});

var upload = multer({ storage : storage}).single('userModel');

module.exports = function(app, passport) {

	/**
	 * homepage route
	 */
	 app.get("/", function(req, res) {
	 	res.render("index.jade",  {
	 		loggedIn : req.isAuthenticated()
	 	});
	 })

	 /**
	  *  Process login
	  */
	 app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	 //						 *
	 //						/|\
	 //					 //|*\
	 //					/*/|\\\
	 //				 ///*|\\*\
	 //						 |
	 //						+++
	 //	 HEPI X MAS FROM 15c BUH

	 /**
	  *  profile
	  */
	 app.get("/profile", isLoggedIn, function(req, res){
	 	var userModels = Model.findOwnerModels(req.user.id, function(err, models){
 			if(err) throw(err);

	 		res.render("profile.jade", {
	 			data : {
	 				user : req.user,
	 				userModels : models.reverse()
	 			}
	 		})		
	 	});
	 	
	 })

	 /**
	  * logout route
	  */
	 app.get("/logout", function(req, res) {
	 	req.logout();
	 	res.redirect("/");
	 })

	 /**
	  * Get all user models
	  */
	 app.get("/api/models", isLoggedIn, function(req, res){
	 		var model = Model.findOwnerModels(req.user.id, function(err, model){
	 			if(err) throw(err);
	 			res.json(model);	
	 		});
	 });

	 /**
	  * Upload route
	  */
	 app.post("/api/upload", isLoggedIn, function(req, res){
	 		upload(req, res, function(err) {
        
        if(err) {
            return res.end("Error uploading file.");
        }
        //res.end("File is uploaded");
        console.log("trying to save to db!");
        
        if(req.file == undefined) return res.end("Meep. Empty file.");

        var myModel = new Model();
        myModel.ownerId = req.user.id;
        myModel.name = req.file.originalname;
        myModel.fileLocation = req.file.path;
        myModel.fileSize = getBytesWithUnit(req.file.size);

        myModel.save(function(err){
        	if(err) return res.end("Error uploading file");
        	else res.redirect("/profile");
        });
    });
	 });

	 app.get("/api/delete/:id", isLoggedIn, function(req, res){
	 	console.log(req.params.id);
	 	Model.deleteModel(req.params.id, req.user.id, function(err) {
	 		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	 		res.redirect("/profile");
	 	});
	 })

	 app.get("/api/upload", function(req, res) {
	 		if(isLoggedIn) res.redirect("/profile");
	 		else res.redirect("/");
	 })

	 /**
	  *  Passport Auth0 Test
	  */
	 
	 app.get("/callback", passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  		function(req, res) {
		    if (!req.user) {
		      throw new Error('user null');
	    }
	   // TODO add them to my user management sys
    res.redirect("/profile");
  });

};

function isLoggedIn(req, res, next) {
	
	if(req.isAuthenticated())
	
		return next();

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
            bytes = bytes.toFixed(3);
        }
	return bytes + units[i];
}
