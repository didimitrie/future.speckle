/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */

// Globally Unique Module

var $               = require('jquery');

var SPKCameraSync = function () {

  var SPKCameraSync = this;
  SPKCameraSync.SPKs = [];

  SPKCameraSync.register = function ( spk ) {
    SPKCameraSync.SPKs.push( spk )
  }

}

module.exports = new SPKCameraSync();