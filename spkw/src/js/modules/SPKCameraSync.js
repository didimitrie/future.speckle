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
    SPKCameraSync.SPKs.push( spk );

    spk.VIEWER.controls.addEventListener("change", function () {
        var mylocation = { }
        mylocation.position = spk.VIEWER.controls.object.position.clone()
        mylocation.rotation = spk.VIEWER.controls.object.rotation.clone()
        mylocation.controlCenter = spk.VIEWER.controls.center.clone()
        SPKCameraSync.sync( spk, mylocation)
      })
  }

  SPKCameraSync.sync = function (originator, location) {
    for( var i = 0; i < SPKCameraSync.SPKs.length; i++ ) {
      var mySPK = SPKCameraSync.SPKs[i]
      if( originator !== mySPK) 
        mySPK.setCamera( JSON.stringify( location) )
    }
  }

  SPKCameraSync.init = function ( spk ) {
    
  }
}

module.exports = new SPKCameraSync();