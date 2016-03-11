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

  SPKMKeyHandler.init = function( options ) {

    for( var i = 0; i < SPKMKeyHandler.SPKs.length; i++ )
    {

      var mySPK = SPKMKeyHandler.SPKs[i];

    }

    if( options.shadows === false ) 
      SPKMKeyHandler.setShadows( false );
    if( options.grid === false )
      SPKMKeyHandler.setGrid ( false );

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

  SPKMKeyHandler.setShadows = function ( value ) {
    for( var i = 0; i < SPKMKeyHandler.SPKs.length; i++ ) {
      var mySPK = SPKMKeyHandler.SPKs[i];
      mySPK.SCENE.shadowlight.shadow.darkness = value === true ? 0.5 : 0;
      mySPK.SCENE.plane.visible = value;
    }
  } 
  
  SPKMKeyHandler.setGrid = function ( value ) {
    for( var i = 0; i < SPKMKeyHandler.SPKs.length; i++ ) {
      var mySPK = SPKMKeyHandler.SPKs[i];
      mySPK.SCENE.grid.visible = value;
    }
  }
}

module.exports = new SPKMKeyHandler();