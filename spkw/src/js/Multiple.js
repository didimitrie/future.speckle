
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
    camerafov : 10,
    lightintensity: 0.9,
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
        showmeasures: false,
        spk : SPK
      } );
    },
    onInstanceChange : function ( data, key ) { 
      var mymeasures = "";
      var found = false;
      for( var i =0; i< data.kvpairs.length && !found; i++ )
        if( data.kvpairs[i].key === key ) {
          mymeasures = data.kvpairs[i].values;
          found = true;
        }
      //console.log(mymeasures)
      var mysplits = mymeasures.split(",");
      var formattedMeasure = "";
      for( var i = 0; i < mysplits.length - 1; i++ ) {
        formattedMeasure += "<strong>" + data.propNames[i] + ": </strong>" + mysplits[i] + " ";
      }
      $("#spk-measures-1").html(formattedMeasure);
    }
  } )

  var mySecondSPK  = new SPK( 
  {
    canvasid : 'spk-canvas-2', 
    zoomonchange : false,
    camerafov : 10,
    lightintensity: 0.9,
    onInitEnd : function ( SPK ) { 

      keyhandler.register( SPK );
      camsync.register( SPK );

      var mySliderCtrl = new SPKSliderControl ( { 
        wrapperid : 'spk-parameters-2',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-sliders',
        data: SPK.PARAMS, 
        showmeasures: false,
        spk : SPK
      } );
      
      keyhandler.init();
    },
    onInstanceChange : function ( data, key ) { 
      var mymeasures = "";
      var found = false;
      for( var i =0; i< data.kvpairs.length && !found; i++ )
        if( data.kvpairs[i].key === key ) {
          mymeasures = data.kvpairs[i].values;
          found = true;
        }
      //console.log(mymeasures)
      var mysplits = mymeasures.split(",");
      var formattedMeasure = "";
      for( var i = 0; i < mysplits.length - 1; i++ ) {
        formattedMeasure += "<strong>" + data.propNames[i] + ": </strong>" + mysplits[i] + " ";
      }
      $("#spk-measures-2").html(formattedMeasure);
    }
  })

} )

