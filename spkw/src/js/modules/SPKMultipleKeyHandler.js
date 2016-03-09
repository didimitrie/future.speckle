/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */

// Globally Unique Module

var $               = require('jquery');

var SPKMKeyHandler = function( options ) {
  
  var SPKMKeyHandler = this;
  SPKMKeyHandler.SPKs = [];

  SPKMKeyHandler.register = function ( spk ) {
    SPKMKeyHandler.SPKs.push( spk );
    console.log( SPKMKeyHandler.SPKs.length );
  }

  SPKMKeyHandler.init = function( ) {

    for( var i = 0; i < SPKMKeyHandler.SPKs.length; i++ )
    {

      var mySPK = SPKMKeyHandler.SPKs[i];

    }

    $( window ).keypress( function ( event ) {
      
      console.log("press event");

      for( var i = 0; i < SPKMKeyHandler.SPKs.length; i++ )
      {
        var mySPK = SPKMKeyHandler.SPKs[i];
      
        switch( event.which ) {
          case 122: // 'z'
            mySPK.zoomExtents( )
          break
          case 115: // 's'
            mySPK.SCENE.shadowlight.shadow.darkness = mySPK.SCENE.shadowlight.shadow.darkness === 0.5 ? 0 : 0.5;
            mySPK.SCENE.plane.visible = !mySPK.SCENE.plane.visible;
          break
          case 103: // 'g'
            mySPK.SCENE.grid.visible = !mySPK.SCENE.grid.visible;
          break;
        }//end switch
      }// end for
    })
  } 
}

module.exports = new SPKMKeyHandler();