
var $                   = require('jquery')
var SPK                 = require('./modules/SPK.js')
var SPKMeta             = require('./modules/SPKMetaDisplay.js')
var SPKSliderControl    = require('./modules/SPKSliderControl.js')
var SPKCommentsControl  = require('./modules/SPKCommentsControl.js')

$( function() {

  var mySPK  = new SPK( 
  {
    canvasid : 'spk-canvas', 
    onInitEnd : function ( SPK ) { 
      
      var myMeta = new SPKMeta ( {
        wrapperid : 'spk-metadata',
        spk : SPK.META
      } );

      var mySliderCtrl = new SPKSliderControl ( { 
        wrapperid : 'spk-parameters',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-sliders',
        data: SPK.PARAMS, 
        open: false,
        spk : SPK
      } );

      var myCommentCtrl = new SPKCommentsControl ( {
        wrapperid : 'spk-comments',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-comments',
        data: SPK.PARAMS,
        open : false,
        spk : SPK
      } );
    }
  } )

} )

