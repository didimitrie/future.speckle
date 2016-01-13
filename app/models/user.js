var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var userSchema = mongoose.Schema({
  auth0id : String,
  username : String,
  tier : String,
  usedStorage : Number
});

userSchema.statics.saveUnique = function(user, saveUser) {
  this.count({auth0id : user.id}, function(err, count) {
    if(count == 0) saveUser();
  });
}

module.exports = mongoose.model('User', userSchema);