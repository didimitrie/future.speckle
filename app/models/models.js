var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var rimraf = require('rimraf');

var modelSchema = mongoose.Schema({
  id : String,
  name : String,
  ownerId : String,
  fileSize : String,
  fileLocation : String, 
  deflateLocation : String
});

modelSchema.statics.findOwnerModels = function(myOwnerId, callback) {
  this.find({ownerId : {$in: [myOwnerId]}}, function(err, model){
      callback(err, model);
    });
}

modelSchema.statics.deleteModel = function(modelId, ownerId, callback) {
  // TODO:
  // check if ownerId = model.ownerId to prevent api abuse
  // TODO: 
  // this will break if I unzip
  // 
  this.findById(modelId , function(err, model) {
    if(err) console.log("DB error");
    if(model) {
      rimraf(model.deflateLocation.replace("./",""), fs, function(){ console.log("yah");});
      //rmdirAsync(model.deflateLocation.replace("./","")); 
      console.log("I should now delete the folder: " + model.deflateLocation.replace("./",""));
      callback(model.fileSize);
    }
    else {
      console.log("No model found in DB");
    }
  }).remove().exec();
}

module.exports = mongoose.model('Models', modelSchema);

var rmdirAsync = function(path, callback) {
  fs.readdir(path, function(err, files) {
    if(err) {
      // Pass the error on to callback
      callback(err, []);
      return;
    }
    var wait = files.length,
      count = 0,
      folderDone = function(err) {
      count++;
      // If we cleaned out all the files, continue
      if( count >= wait || err) {
        fs.rmdir(path,callback);
      }
    };
    // Empty directory to bail early
    if(!wait) {
      folderDone();
      return;
    }
    
    // Remove one or more trailing slash to keep from doubling up
    path = path.replace(/\/+$/,"");
    files.forEach(function(file) {
      var curPath = path + "/" + file;
      fs.lstat(curPath, function(err, stats) {
        if( err ) {
          callback(err, []);
          return;
        }
        if( stats.isDirectory() ) {
          rmdirAsync(curPath, folderDone);
        } else {
          fs.unlink(curPath, folderDone);
        }
      });
    });
  });
};




