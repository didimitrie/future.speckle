
var $                   = require('jquery')
var SPK                 = require('./modules/SPK.js')
var SPKMeta             = require('./modules/SPKMetaDisplay.js')
var SPKSliderControl    = require('./modules/SPKSliderControl.js')
var SPKCommentsControl  = require('./modules/SPKCommentsControl.js')
var SPKHelpControl      = require('./modules/SPKHelpControl.js')
var keyhandler          = require('./modules/SPKMultipleKeyHandler.js')
var camsync             = require('./modules/SPKCameraSync.js')


$( function () {

  var myFirstSPK  = new SPK( 
  {
    canvasid : 'spk-canvas-1', 
    zoomonchange : false,
    onInitEnd : function ( SPK ) {

      keyhandler.register( SPK );
      camsync.register( SPK );

      var myMeta = new SPKMeta ( {
        wrapperid : 'spk-metadata',
        spk : SPK.META
      } ); 
      
      var mySliderCtrl = new SPKSliderControl ( { 
        wrapperid : 'spk-parameters-1',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-sliders',
        data: SPK.PARAMS, 
        open: false,
        spk : SPK
      } );
    }
  } )

  var mySecondSPK  = new SPK( 
  {
    canvasid : 'spk-canvas-2', 
    zoomonchange : false,
    onInitEnd : function ( SPK ) { 

      keyhandler.register( SPK );
      camsync.register( SPK );

      var mySliderCtrl = new SPKSliderControl ( { 
        wrapperid : 'spk-parameters-2',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-sliders',
        data: SPK.PARAMS, 
        open: false,
        spk : SPK
      } );
      
      keyhandler.init();
    }
  } )    

} )

