
var $                   = require('jquery')
var SPK                 = require('./modules/SPK.js')
var SPKMeta             = require('./modules/SPKMetaDisplay.js')
var SPKSliderControl    = require('./modules/SPKSliderControl.js')
var SPKCommentsControl  = require('./modules/SPKCommentsControl.js')
var SPKHelpControl      = require('./modules/SPKHelpControl.js')
var SPKKeyHandler       = require('./modules/SPKKeyHandler.js')

$( function () {

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
        showmeasures: false,
        spk : SPK
      } );

      /*
      
      var myCommentCtrl = new SPKCommentsControl ( {
        wrapperid : 'spk-comments',
        formid : 'instance-saver-form',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-comments',
        data: SPK.PARAMS,
        open : false,
        spk : SPK
      } );
       */
      var myKeyHandler = new SPKKeyHandler ( {
        spk: SPK
      })
      //window.SPK = mySPK;
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
        formattedMeasure += "<div class='measure-group'><h1>" + data.propNames[i] + ":&nbsp&nbsp</h1><p>" + mysplits[i] + "</p></div>";
      }
      $("#spk-measures").html(formattedMeasure);
    }
  } )

} )

