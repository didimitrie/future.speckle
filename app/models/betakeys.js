var mongoose = require("mongoose");

var betaKey = mongoose.Schema({
  key: String,
  max: Number,
  used: Number
});

module.exports = mongoose.model('betaKey', betaKey);