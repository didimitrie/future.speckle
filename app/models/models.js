var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var rimraf = require('rimraf');

var modelSchema = mongoose.Schema({
  id : String,
  name : String,
  ownerId : String,
  fileSize : String,
  formatedFileSize : String,
  fileLocation : String, 
  deflateLocation : String,
  dateAdded : String,
  timestamp : { type: Date, default: Date.now},
  urlId : String,
  savedInstances : [ { 
    key: String, 
    description: String,
    requestip : String,
    camerapos : String,
    timestamp: { type: Date, default: Date.now }
  }]
});


modelSchema.statics.findOwnerModels = function(myOwnerId, callback) {
  // .sort('-date').exec(function(err, docs) {
  this.find({ownerId : {$in: [myOwnerId]}}).sort('timestamp').exec( function(err, model){
      callback(err, model);
    });
}

modelSchema.statics.deleteModel = function(modelId, ownerId, callback) {
  // TODO:
  // check if ownerId = model.ownerId to prevent api abuse
  this.findById(modelId , function(err, model) {
    if(err) console.log("DB error");
    if(model) {
      // delete the folder
      rimraf(model.deflateLocation.replace("./",""), fs, function(){});
      // call the callback, we're more or less done
      callback(model.fileSize);
    }
    else {
      console.log("No model found in DB. This is an error. Meep :/");
      callback(0);
    }
  }).remove().exec();

};

module.exports = mongoose.model('Models', modelSchema);




