/**
 *
 * 
 *  Model management routes:
 *  - Profile
 *    - Displays a list of models and allows the upload of new ones
 *    - Uploading
 *    - Deleting
 *    
 *  - TODO: Model Admin 
 *    - Change model name
 *    - Rename/Hide parameters and performance values
 *    - Choose "dashboards"
 *    - Choose environment
 *    
 *  - TODO: Model usage statistics dashboard
 *    - Number of sessions, duration, most used instances
 *    - Named instances, Performance mapping, etc.
 *    
 *  - TODO: User account details & modifications
 *    - Change name & profile picture
 *    - Email details, etc.
 *    
 *  
 */

var Model           = require('../../app/models/models')
var User            = require('../../app/models/user')
var Session         = require('../../app/models/session')
var DecompressZip   = require('decompress-zip')
var shortid         = require('shortid')
var fs              = require('fs')
var path            = require('path')
var multer          = require('multer')
var appDir          = path.dirname(require.main.filename)

var storage         = multer.diskStorage({
  destination : function( req, file, cb ) { cb( null, './uploads' )},
  filename    : function( req, file, cb ) { cb( null, getName(req) )}
})
var upload          = multer( { storage: storage} ).single('userModel');

module.exports = function( app, passport, express ) { 
  
  app.get( "/profile", isLoggedIn, function( req, res ){
    Model.findOwnerModels( req.user.id, function( err, models ){
      res.render( "profile.jade", {
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

  app.post( "/api/upload", isLoggedIn, function( req, res){
    upload(req, res, function(err) {
      if(req.file == undefined)
        return res.end("No file selected.");

      var unzipper = new DecompressZip(req.file.path);      
      var extractionPath = "./uploads/" + req.file.path.replace("uploads", "deflated");
      
      unzipper.extract({ path: extractionPath });

      unzipper.on('extract', function (log) {
        fs.unlink(req.file.path, function (err) { 
          console.log("ERR_UPLOAD: failed to delete original zip") 
        });
      });

      var myModel = new Model();
      var name = req.file.path.split("-");

      myModel.ownerId           = req.user.id; 
      myModel.name              = req.file.originalname.replace(".zip", "");
      myModel.fileLocation      = req.file.path.replace("uploads/","");
      myModel.deflateLocation   = extractionPath;
      myModel.fileSize          = req.file.size;
      myModel.formatedFileSize  = getBytesWithUnit(req.file.size);
      myModel.dateAdded         = getFormatedDate();
      myModel.urlId             = name[2]; 

      myModel.save();

      User.findOne({auth0id : req.user.id}, function(err, user) {
        user.usedStorage += req.file.size;
        user.save();
      });

      res.json({ok: "ok"});
    });
  });

  app.get("/api/delete/:id", isLoggedIn, function(req, res){
    Model.deleteModel(req.params.id, req.user.id, function(fileSize) {
      User.findOne({auth0id : req.user.id}, function(err, user) {
          user.usedStorage -= fileSize;
          user.save();
          res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
          res.redirect("/profile");
        });
    });
  });

  app.get( "/analytics/:m", isLoggedIn, function( req, res ) {
    var modelId = req.params.m;
    Model.findOne( { urlId : modelId }, function( err, model ) {
      if( req.user.id != model.ownerId )  
        res.send( "ERR: You are not authorized to view the metadata of this model." );
      else 
        Session.find( { modelid: modelId }, function( err, sessions ) {
          res.json( sessions );
        });
    });
  });

} // module.exports end


function getName ( req ) { 
  return Date.now() + '-' + req.user.id + '-' + shortid.generate(); 
}

function isLoggedIn( req, res, next ) {
  if(req.isAuthenticated()) {
    User.findOne( {auth0id : req.user.id}, function( err, user ){
      if(err) res.redirect("/");
      req.myUser = user;
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

function getQouta( usedStorage ) {
  var maxStorage = 1073741824; // 1 GB
  return (usedStorage / maxStorage * 100);
}
