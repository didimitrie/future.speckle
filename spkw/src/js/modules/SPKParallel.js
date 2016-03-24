/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */


var $               = require('jquery');
var noUISlider      = require('nouislider');
var shortid         = require('shortid');



var SPKSliderControl = function ( options ) { 
  
  var SPKSliderControl = this;
  
  SPKSliderControl.id = shortid.generate();
  SPKSliderControl.Options = {};
  SPKSliderControl.Data = {};
  SPKSliderControl.Wrapper = {};
  SPKSliderControl.SPK = {};
  SPKSliderControl.Sliders = [];
  SPKSliderControl.MeasureSliders = []; 

  SPKSliderControl.init = function ( options ) {
  
    SPKSliderControl.Options = options;
    SPKSliderControl.Wrapper = $( "#" + options.wrapperid );
    SPKSliderControl.SPK = options.spk;
    SPKSliderControl.Data = options.data;

    $( SPKSliderControl.Wrapper ).attr( "spktabid", SPKSliderControl.id );

    // register 'tab' in ui-tabs
    var uitabs = $( "#" + options.uitabid);
    var icon = "<div class='icon icon-active' spkuiid='" + SPKSliderControl.id + "'><span class='hint--right' data-hint='Paramaters & Performance'><i class='fa " + options.icon + "'></span></div>";
    $(uitabs).append(icon);
    
    $("[spkuiid='"+ SPKSliderControl.id + "']").click( function() {
      $( "#spk-ui-tabs").find(".icon").removeClass( "icon-active" );
      $( this ).addClass( "icon-active" );
      $( ".sidebar" ).addClass( "sidebar-hidden" );
      $( "[spktabid='"+ SPKSliderControl.id + "']").removeClass( "sidebar-hidden" );
    } )

    // prepare data for d3 parallel coords graph

    var mydata = SPKSliderControl.Data;
    var d3Data = "";
    // add the property names
    for( var i = 0; i < mydata.parameters.length; i++ )
      d3Data += mydata.parameters[i].name + ",";

    for( var i = 0; i < mydata.propNames.length; i++ ) {
      d3Data += mydata.propNames[ i ];
      if( i < mydata.propNames.length - 1) d3Data += ",";
    }
    d3Data += "\n";
    for( var i = 0; i < mydata.kvpairs.length; i++ ) {
      d3Data += mydata.kvpairs[ i ].key + mydata.kvpairs[ i ].values.substring( 0, mydata.kvpairs[ i ].values.length - 1 ) + "\n";
    }

    options.onInitEnd( d3Data, SPKSliderControl.SPK );
  }


  SPKSliderControl.getCurrentKey = function () {
    var key = "";
    for( var i = 0; i < SPKSliderControl.Sliders.length; i++ ) {
      key += Number( SPKSliderControl.Sliders[i].get() ).toString() + ","; 
    }
    return key;
  }

  SPKSliderControl.init( options );

}

module.exports = SPKSliderControl;