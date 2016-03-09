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
  }

  SPKCameraSync.init = function ( spk ) {
    for( var i = 0; i < SPKCameraSync.SPKs.length; i++ ) {
      var mySPK = SPKCameraSync.SPKs[i];
      console.log( mySPK.VIEWER.controls );
      
      mySPK.VIEWER.controls.addEventListener("change", function () {
        //console.log(this);
        var mylocation = { }
        mylocation.position = mySPK.VIEWER.controls.object.position.clone()
        mylocation.rotation = mySPK.VIEWER.controls.object.rotation.clone()
        mylocation.controlCenter = mySPK.VIEWER.controls.center.clone()

        //console.log(mylocation)

        for( var j = 0; j < SPKCameraSync.SPKs.length; j++ ) {
          if(i != j) 
            SPKCameraSync.SPKs[j].setCamera( JSON.stringify( mylocation ) )
        }

       })
    }
  }
}

module.exports = new SPKCameraSync();