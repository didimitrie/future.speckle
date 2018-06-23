
var $                   = require('jquery')
var SPK                 = require('./modules/SPK.js')
var SPKMeta             = require('./modules/SPKMetaDisplay.js')
var SPKSliderControl    = require('./modules/SPKSliderControl.js')
var SPKCommentsControl  = require('./modules/SPKCommentsControl.js')
var SPKHelpControl      = require('./modules/SPKHelpControl.js')
var keyhandler          = require('./modules/SPKMultipleKeyHandler.js')
var camsync             = require('./modules/SPKCameraSync.js')
var SPKLogger = require( './modules/SPKLogger.js' )

window.submitSelection = function ( arg ) {
//    console.log( window.Logger.sessionid + " >>> https://survey.engagingmobility.com/index.php/357942?newtest=Y&lang=en&DSEID=1234567890" )
//    new link: 
//    https://survey.engagingmobility.com/index.php/357942?newtest=Y&lang=en&DSEID=1234567890
    if( arg ) {
      window.Logger.addUsedInstance( arg )
    }
    location.assign( "https://survey.engagingmobility.com/index.php/357942?newtest=Y&lang=en&DSEID=" + window.Logger.sessionid )
}


$( function () {
  
  window.Logger = SPKLogger

  SPKLogger.newSession( window.location.href.substr( window.location.href.lastIndexOf( '/' ) + 1 ) )
  // SPKLogger.newSession( href.substr( window.location.href.lastIndexOf( '/' ) + 1 ) )

  var myFirstSPK  = new SPK( 
  {
    canvasid : 'spk-canvas-1', 
    zoomonchange : false,
    camerafov : 40,
    lightintensity: 0.4,
    grid: true,
    clearColor: '#666666',
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
        spk : SPK,
        logger: SPKLogger,
        selectButton: {
          text: 'Select Version A',
          id: 'VERSION-A'
        }
      } );

      // setInterval( mouseTrajectory, 500 )

      // function mouseTrajectory( ) {
      //   SPKLogger.addMouseTrace( )
      // }

    }
  } )

  var mySecondSPK  = new SPK( 
  {
    canvasid : 'spk-canvas-2', 
    zoomonchange : false,
    camerafov : 40,
    lightintensity: 0.4,
    grid: true,
    clearColor: '#666666',
    onInitEnd : function ( SPK ) { 

      keyhandler.register( SPK );
      camsync.register( SPK );

      var mySliderCtrl = new SPKSliderControl ( { 
        wrapperid : 'spk-parameters-2',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-sliders',
        data: SPK.PARAMS, 
        showmeasures: false,
        spk : SPK,
        logger: SPKLogger,
        selectButton: {
          text: 'Select Version B',
          id: 'VERSION-B'
        }
      } );
      
      keyhandler.init({
      });
    }
  })

} )

