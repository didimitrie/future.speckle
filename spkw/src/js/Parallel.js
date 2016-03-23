
var $                   = require('jquery')
var SPK                 = require('./modules/SPK.js')
var SPKMeta             = require('./modules/SPKMetaDisplay.js')
var SPKParallelControl  = require('./modules/SPKParallel.js')
var SPKCommentsControl  = require('./modules/SPKCommentsControl.js')
var SPKHelpControl      = require('./modules/SPKHelpControl.js')
var SPKKeyHandler       = require('./modules/SPKKeyHandler.js')
var d3                  = require('d3'); window.d3 = d3;
var parcoords           = require('./modules/external/d3.parcoords.js');
var divgrid             = require('./modules/external/divgrid.js');
var sylvester           = require('./modules/external/sylvester.js');

var remap = function ( value, from1, to1, from2, to2 ) {
  return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

var dod3 = function ( data, SPK ) {
    
    $(".parcoords").width( $( ".sidebar" ).innerWidth() - 20 + "px" ); 
    $(".parcoords").height( $( ".sidebar" ).innerHeight() * 0.5 + "px" ); 

    var myData = d3.csv.parse( data );
    var grid = d3.divgrid();

    var pc = d3.parcoords( )( "#spk-parameters" )
               .data( myData )
               .color( "#000" )
               .alpha( 0.1 )
               .mode( "queue" )
               .smoothness( 0.1 )
               .render( )
               .shadows( )
               .createAxes( )
               //.margin({ top: 40, left: 20, bottom: 12, right: 20 })
               .brushMode( "1D-axes" );
    
    // make the first grid instance
    d3.select("#spk-datagrid")
      .datum( myData.slice(0,100) )
      .call( grid )
      .selectAll(".row")
      .on({
        "mouseover": function(d) { pc.highlight( [d] ); SPK.loadParallelInstance(d); },
        "mouseout": pc.unhighlight
      });

    var text = d3.select("text");
var bbox = text.node().getBBox();
var padding = 2;
var rect = self.svg.insert("rect", "text")
    .attr("x", bbox.x - padding)
    .attr("y", bbox.y - padding)
    .attr("width", bbox.width + (padding*2))
    .attr("height", bbox.height + (padding*2))
    .style("fill", "red");
    
    pc.on("brush", function(d) { 
     
      console.log( d.length )
     
      if( d.length < 100 ) {
        var myopacity = remap( d.length, 100, 1, 0, 1)
        pc.alpha( myopacity );
        console.log(myopacity + "\n\n")
      } else {
        pc.alpha( 0.1 )
      }
      d3.select("#spk-datagrid")
      .datum( d.slice(0,100) )
      .call( grid )
      .selectAll(".row")
      .on({
        "click" : function ( d ) { console.log("HAHA"); SPK.loadParallelInstance(d); }, 
        "mouseover": function(d) { pc.highlight( [d] ); /*SPK.xxxxloadParallelInstance(d); */},
        "mouseout": pc.unhighlight
      });
  
    });
}

$( function () {

  var mySPK  = new SPK( 
  {
    canvasid : 'spk-canvas', 
    onInitEnd : function ( SPK ) { 
      
      var myMeta = new SPKMeta ( {
        wrapperid : 'spk-metadata',
        spk : SPK.META
      } );

      var mySliderCtrl = new SPKParallelControl ( { 
        wrapperid : 'spk-parameters',
        uitabid : 'spk-ui-tabs',
        icon : 'fa-sliders',
        data: SPK.PARAMS,
        spk : SPK,
        onInitEnd : dod3
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
      //window.SPK = mySPK;
    }
  } )

} )

