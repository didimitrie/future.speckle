
var $                   = require('jquery'); window.$ = $;
var SPK                 = require('./modules/SPK.js')
var SPKMeta             = require('./modules/SPKMetaDisplay.js')
var SPKParallelControl  = require('./modules/SPKParallel.js')
var SPKKeyHandler       = require('./modules/SPKKeyHandler.js')
var d3                  = require('./modules/external/d3.v3.min.js'); window.d3 = d3;
var parcoords           = require('./modules/external/d3.parcoords.js');


$( function () {

  var dod3 = function ( datax ) {

  var myData = d3.csv.parse(datax);

  var pc = d3.parcoords()("#spk-parameters")
    .data(myData)
    .hideAxis(["name"])
    .alpha(0.15)
    .margin({ top: 15, left: 15, bottom: 15, right: 15 })
    .mode("queue")
    .render()
    .brushMode("1D-axes");

  }

  var mySPK  = new SPK( 
  {
    canvasid : 'spk-canvas', 
    onInitEnd : function ( SPK ) { 

      var mySliderCtrl = new SPKParallelControl ( { 
        wrapperid : 'spk-parameters',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-sliders',
        data: SPK.PARAMS,
        spk : SPK,
        onInitEnd : dod3
      } );
      //window.SPK = mySPK;
    }
  } )

} )

