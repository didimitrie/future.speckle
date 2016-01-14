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
      //rimraf(model.deflateLocation, fs, function(){});
      console.log("I should now delete the folder: " + model.deflateLocation);
    }
    else {
      console.log("No model found in DB");
    }
  }).remove().exec();
}

module.exports = mongoose.model('Models', modelSchema);