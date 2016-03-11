/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */

var $               = require('jquery');

var SPKKeyHandler = function( options ) {
  
  var SPKKeyHandler = this;
  SPKKeyHandler.SPK = {}

  SPKKeyHandler.init = function( options ) {
    
    SPKKeyHandler.SPK = options.spk;

    $( window ).keypress( function ( event ) {

      console.log( event.which )
      switch( event.which ) {
        case 122: // 'z'
          SPKKeyHandler.SPK.zoomExtents( )
        break

        case 115: // 's'
          SPKKeyHandler.SPK.SCENE.shadowlight.shadow.darkness = SPKKeyHandler.SPK.SCENE.shadowlight.shadow.darkness === 0.5 ? 0 : 0.5;
          SPKKeyHandler.SPK.SCENE.plane.visible = !SPKKeyHandler.SPK.SCENE.plane.visible;
        break

        case 103: // 'g'
          SPKKeyHandler.SPK.SCENE.grid.visible = !SPKKeyHandler.SPK.SCENE.grid.visible;
        break;

      }

    })

    if( options.shadows === false ) {
      SPKKeyHandler.SPK.SCENE.shadowlight.shadow.darkness = SPKKeyHandler.SPK.SCENE.shadowlight.shadow.darkness === 0.5 ? 0 : 0.5;
      SPKKeyHandler.SPK.SCENE.plane.visible = !SPKKeyHandler.SPK.SCENE.plane.visible;
    }

    if( options.grid === false ) {
      SPKKeyHandler.SPK.SCENE.grid.visible = !SPKKeyHandler.SPK.SCENE.grid.visible;
    }

  } 

  SPKKeyHandler.init( options );
}

module.exports = SPKKeyHandler;