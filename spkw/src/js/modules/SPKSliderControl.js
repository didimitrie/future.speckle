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

  SPKSliderControl.Logger = options.logger

  SPKSliderControl.init = function ( options ) {

    SPKSliderControl.Options = options;
    SPKSliderControl.Wrapper = $( "#" + options.wrapperid );
    SPKSliderControl.SPK = options.spk;
    SPKSliderControl.Data = options.data;
    SPKSliderControl.Logger = options.logger

    console.log( options  )

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

    SPKSliderControl.makeSliders( options.data.parameters );
    
    if( options.selectButton )  {
      $( SPKSliderControl.Wrapper ).append("<button class='super-button' onclick='window.submitSelection(`" + options.selectButton.id + "`)'>" + options.selectButton.text + "</button>")
    }

    if( options.showmeasures === true ) 
      SPKSliderControl.makeMeasureSliders( options.data.properties );
  }

  SPKSliderControl.makeSliders = function ( params ) {
    
    if( SPKSliderControl.Options.showmeasures ) 
      $( SPKSliderControl.Wrapper ).append("<h1 class='slider-group-title'>Model Parameters</h1>")
    else 
      $( SPKSliderControl.Wrapper ).append( "<br>" );
    for( var i = 0; i < params.length; i++ ) {
        
        var paramId = "parameter_" + i + shortid.generate();
        var paramName = params[i].name === "" ? "Unnamed Parameter" : params[i].name;

        $( SPKSliderControl.Wrapper ).append( $( "<div>", { id: paramId, class: "parameter" } ) );
        
        $( "#" + paramId ).append( "<p class='parameter_name'>" + paramName + "</p>" );
        
        var sliderId = paramId + "_slider_" + i + "_" ;

        $( "#" + paramId ).append( $( "<div>", { id: sliderId, class: "basic-slider" } ) );

        var myRange = {}, norm = 100 / (params[i].values.length-1);

        for( var j = 0; j < params[i].values.length; j++ ) {

          myRange[ norm * j + "%" ] = params[i].values[j];

        }
        
        myRange["min"] = myRange["0%"]; delete myRange["0%"];
      
        myRange["max"] = myRange["100%"]; delete  myRange["100%"];

        var sliderElem = $( "#" + sliderId )[0];
        
        var slider = noUISlider.create( sliderElem, {
          start : [0],
          conect : false,
          tooltips : true,
          snap : true,
          range : myRange,
          pips : {
            mode : "values",
            values : params[i].values,
            density : 3
          }
        });
        SPKSliderControl.Sliders.push( slider );
      }

    for( var i = 0; i < SPKSliderControl.Sliders.length; i++ ) {
      SPKSliderControl.Sliders[i].on( "change", function() { 
        var currentKey = SPKSliderControl.getCurrentKey();
        SPKSliderControl.SPK.addNewInstance( currentKey, function() { 
          if( ! ( SPKSliderControl.SPK.Options.zoomonchange === false ) )
            if(SPKSliderControl.SPK.Options.lockCameraOnInstanceChange === false)
              SPKSliderControl.SPK.zoomExtents(); 
        } );
        SPKSliderControl.setMeasureSliders( currentKey );
        //SPKSliderControl.SPK.zoomExtents()
      } );
    }
  }

  SPKSliderControl.makeMeasureSliders = function ( params ) {
    
    if( params === undefined || params.length == 0 )
      return;

    $( SPKSliderControl.Wrapper ).append("<br><br><h1 class='slider-group-title'>Performance Measures</h1>")

    for( var i = 0; i < params.length; i++ ) {
      var param = params[i];

      var myRange = param.values; myRange.sort( function( a,b ) { return a-b } );

      var sliderRange = {
        "min" : Number(myRange[0]),
        "max" : Number(myRange[myRange.length-1])
      }
      
      var wrpName = "measure-wrapper-" + i + "_" + shortid.generate();
      var container = $( SPKSliderControl.Wrapper ); 
      
      var myMeasureWrapper = $( container ).append( $("<div>", {id: wrpName, class:"measure parameter"}) );
      var finalFuckingName = "<p>" + param.name  + "</p><p> <span class='pull-left'>(MIN) " + myRange[0] + "</span> " + " <span class='pull-right'>" + myRange[myRange.length-1] + " (MAX)</span></p>";
      $( "#" + wrpName ).append( $( "<p>", { class: "measure-name parameter_name text-center", html: finalFuckingName } ) );
      var sliderId = "measure-" + i + "_" + shortid.generate();
      $( "#" + wrpName ).append( $("<div>", { id: sliderId, class: "basic-slider measure-slider" } ) );
    
  
    var slider = noUISlider.create( $("#"+sliderId)[0], {
          start : [0],
          conect : true,
          tooltips : true,
          snap : false,
          range: sliderRange,
          disable: true,
          
    });

    $("#"+sliderId)[0].setAttribute('disabled', true);

    SPKSliderControl.MeasureSliders.push(slider);
    }
  }

  SPKSliderControl.setMeasureSliders = function ( key ) {
    var mymeasures = "";
    var found = false;
    for( var i =0; i< SPKSliderControl.Data.kvpairs.length && !found; i++ )
      if( SPKSliderControl.Data.kvpairs[i].key === key ) {
        mymeasures = SPKSliderControl.Data.kvpairs[i].values;
        found = true;
      }
  
    var mysplits = mymeasures.split(",");

    for( var i = 0; i < SPKSliderControl.MeasureSliders.length; i++ ) 
      SPKSliderControl.MeasureSliders[i].set(Number(mysplits[i]));
  }

  SPKSliderControl.getCurrentKey = function () {
    var key = "";
    for( var i = 0; i < SPKSliderControl.Sliders.length; i++ ) {
      key += Number( SPKSliderControl.Sliders[i].get() ).toString() + ","; 
    }
    if( SPKSliderControl.Options.selectButton )  { 
      SPKSliderControl.Logger.addUsedInstance( SPKSliderControl.Options.selectButton.id + ':' + key )
    } else
      SPKSliderControl.Logger.addUsedInstance( key )
    //  add logger log

    return key;
  }

  SPKSliderControl.init( options );

}

module.exports = SPKSliderControl;