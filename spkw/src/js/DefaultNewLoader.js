
var $                   = require('jquery')
var SPK                 = require('./modules/SPKViewer.js')
var SPKMeta             = require('./modules/SPKMetaDisplay.js')
var SPKSliderControl    = require('./modules/SPKSliderControl.js')
var SPKCommentsControl  = require('./modules/SPKCommentsControl.js')
var SPKHelpControl      = require('./modules/SPKHelpControl.js')
var SPKKeyHandler       = require('./modules/SPKKeyHandler.js')

// pub subbing
var events = require('./modules/SPKPubSub.js');
var car = null;
$( function () {

  var mySPK  = new SPK( 
  {
    canvasid : 'spk-canvas', 
    onInitEnd : function ( SPK ) { 
      console.log("hello");
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
        showmeasures: true,
        spk : SPK
      } );

      var myCommentCtrl = new SPKCommentsControl ( {
        wrapperid : 'spk-comments',
        formid : 'instance-saver-form',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-comments',
        data: SPK.PARAMS,
        open : false,
        spk : SPK
      } );

      var myHelpCtrl = new SPKHelpControl ( {
        wrapperid : 'spk-help',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-info-circle'
        //icon : 'fa-cogs'
      })

      var myKeyHandler = new SPKKeyHandler ( {
        spk: SPK
      })
      window.SPK = mySPK;
    }
  } )

  var sub = events.subscribe("spk-init", function( event ) {
    console.log(event);
  })

} )

