
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
    $(".parcoords").height( $( ".sidebar" ).innerHeight() * 0.5 - 20 + "px" ); 

    var myData = d3.csv.parse( data );
    var grid = d3.divgrid();
   
    var pc = d3.parcoords( )( "#spk-parameters" )
               .data( myData )
               .color( "#666666" )
               .alpha( 0.05 )
               .mode( "queue" )
               .margin({ top: 100, left: 20, bottom: 12, right: 20 })
               .render( )
               .shadows( )
               .createAxes( )
               .reorderable( )
               .brushMode( "1D-axes" );
    
    pc.svg.selectAll("text.label").attr("transform", "translate(0,-5) rotate(-25)");

    pc.on( "brush", function( d ) { 
      brushfunction( d );
      SPK.loadParallelInstance(d[0]); 
    } );

    pc.on( "brushend", function( d ) { 
      $(".selected-row").removeClass("selected-row")
      //SPK.loadParallelInstance(d[0]); 
      $($(".row")[0]).addClass("selected-row");
    });

    var brushfunction = function ( d ) {
      if( d.length < 100 ) {
        var myopacity = remap( d.length, 100, 1, 0, 1)
        pc.alpha( myopacity );
      } else
        pc.alpha( 0.1 )
      
      d3.select("#spk-datagrid")
      .datum( d.slice( 0, 20 ) )
      .call( grid )
      .selectAll( ".row" )
      .on({
        "click" : function ( d ) { 
          SPK.loadParallelInstance( d ); 
          d3.select( [ d ] ).classed( "selected" );
        }, "mouseover": function(d) { 
          pc.highlight( [d] ); 
        }, "mouseout": pc.unhighlight
      });
      // reinstate widths because we suck
      var num = $( ".header" ).find( ".cell" ).length;
      $( ".cell" ).width( ( 100 / (num) ) + "%" );
      $( ".cell" ).click( function () {
        $( ".selected-row" ).removeClass( "selected-row" )
        $(this).closest( ".row" ).addClass( "selected-row" )
      })

      // and hover behaviours
      $(".cell").hover( function() {
        var cls = this.className.split(" ")[0]; 
        var dimnumber = cls.split("-")[1];
        $("." + cls ).addClass("column-select");
        var mystuff = pc.svg.selectAll("dimension");
        $(mystuff[ 0 ].parentNode.children[ dimnumber ]).addClass("hoverdimension");

      } , function() {
        var cls = this.className.split(" ")[0];
        var dimnumber = cls.split("-")[1];
        $("." + cls ).removeClass("column-select")
         var mystuff = pc.svg.selectAll("dimension");
        $(mystuff[ 0 ].parentNode.children[ dimnumber ]).removeClass("hoverdimension");
      })

      var number1 = 0;
      if( d.length > 20 ) 
        number1 = 20; 
      else 
        number1 = d.length;
      $(".selection-info").html("Displaying <strong>" +number1 +"</strong> solutions out of a total of <strong>" + d.length + "</strong> selected.");

    }

    brushfunction( myData.slice(0,100) );
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

