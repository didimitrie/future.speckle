var $ = require( 'jquery' )
var SPK = require( './modules/SPK.js' )
var SPKMeta = require( './modules/SPKMetaDisplay.js' )
var SPKSliderControl = require( './modules/SPKSliderControl.js' )
var SPKCommentsControl = require( './modules/SPKCommentsControl.js' )
var SPKHelpControl = require( './modules/SPKHelpControl.js' )
var SPKKeyHandler = require( './modules/SPKKeyHandler.js' )
var SPKLogger = require( './modules/SPKLogger.js' )

window.submitSelection = function () {
//    console.log( window.Logger.sessionid + " >>> https://survey.engagingmobility.com/index.php/357942?newtest=Y&lang=en&DSEID=1234567890" )
    location.assign( "https://survey.engagingmobility.com/index.php/357942?newtest=Y&lang=en&DSEID=" + window.Logger.sessionid )
}

$( function( ) {

  window.SPK = mySPK
  window.Logger = SPKLogger

  var mySPK = new SPK( {
    canvasid: 'spk-canvas',
    onInitEnd: function( SPK ) {

      var myMeta = new SPKMeta( {
        wrapperid: 'spk-metadata',
        spk: SPK.META
      } );

      SPKLogger.newSession( SPK.GLOBALS.model )

      var mySliderCtrl = new SPKSliderControl( {
        wrapperid: 'spk-parameters2',
        uitabid: 'spk-ui-tabs',
        icon: 'fa-sliders',
        data: SPK.PARAMS,
        open: false,
        showmeasures: true,
        spk: SPK,
        logger: SPKLogger
      } );

      // var myCommentCtrl = new SPKCommentsControl ( {
      //   wrapperid : 'spk-comments',
      //   formid : 'instance-saver-form',
      //   uitabid : 'spk-ui-tabs',
      //   icon : 'fa-comments',
      //   data: SPK.PARAMS,
      //   open : false,
      //   spk : SPK
      // } );

      // var myHelpCtrl = new SPKHelpControl ( {
      //   wrapperid : 'spk-help',
      //   uitabid : 'spk-ui-tabs',
      //   icon : 'fa-info-circle'
      //   //icon : 'fa-cogs'
      // })

      var myKeyHandler = new SPKKeyHandler( {
        spk: SPK
      } )

      setInterval( mouseTrajectory, 500 )

      function mouseTrajectory( ) {
        SPKLogger.addMouseTrace( )
      }
      //window.SPK = mySPK;
    }
  } )

} )