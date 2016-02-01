var mongoose = require("mongoose");

var waitingList = mongoose.Schema({
  email: String
});

module.exports = mongoose.model('waitingList', waitingList);