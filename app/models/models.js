var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);

var modelSchema = mongoose.Schema({
  id : String,
  name : String,
  ownerId : String,
  fileSize : String,
  fileLocation : String
});

modelSchema.statics.findOwnerModels = function(myOwnerId, callback) {
  this.find({ownerId : {$in: [myOwnerId]}}, function(err, model){
      callback(err, model);
    });
}

modelSchema.statics.deleteModel = function(modelId, ownerId, callback) {
  // TODO:
  // check if ownerId = model.ownerId to prevent api abuse
  // TODO !important:
  // before db delete, make sure to fs.remove!!!
  // 
  this.findById(modelId , function(err, model) {
    if(err) console.log(err);
    // delete file
    if(model) 
      fs.unlink( appDir + '/' + model.fileLocation, function (err) {
        if (err) throw err;
        console.log('successfully deleted ' + model.fileLocation);
      });
    else console.log("no model found, fail, f@1L, fA1l");
  }).remove().exec();
  //this.find({_id : modelId}).remove().exec();
  callback();
}

module.exports = mongoose.model('Models', modelSchema);