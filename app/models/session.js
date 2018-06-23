var mongoose = require("mongoose");

var sessionSchema = mongoose.Schema({
  ip: String,
  modelid: String,
  viewportsize: String,
  accesstime: { type: Date, default: Date.now },
  exittime: { type: Date, default: '0' },
  usedinstances : [{
    key: String,
    timestamp: { type: Date, default: Date.now }
  }],
  mouseclicks: [ {
    location: { },
    timestamp: { type: Date, default: Date.now }
  }],
  mousetraces: [ {
    location: { },
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Session', sessionSchema);