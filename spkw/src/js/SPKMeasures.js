
var $               = require('jquery');
var noUISlider      = require('nouislider');

var SPKMeasures = function () {

  var SPKMeasures = this;

  SPKMeasures.data = null;
  SPKMeasures.kvpairs = null;
  SPKMeasures.names = null;

  SPKMeasures.mySliders = [];


  SPKMeasures.init = function(parametersdata, keyvaluepairs, propNames) {

    SPKMeasures.data = parametersdata;
    SPKMeasures.kvpairs = keyvaluepairs;
    SPKMeasures.names = propNames;

    console.log(SPKMeasures.kvpairs);

    for( var i = 0; i < SPKMeasures.data.length; i++ ) {
      SPKMeasures.createSlider(SPKMeasures.data[i], i);
    }

  }

  SPKMeasures.createSlider = function(param, index) {

    var myRange = param.values;
    myRange.sort(function(a,b) { return a-b});
    console.log(myRange);

    var sliderRange = {
      "min" : Number(myRange[0]),
      "max" : Number(myRange[myRange.length-1])
    }


    var container = $("#spk-measures-ui").find("#wrapper-measures");

    var myMeasureWrapper = $(container).append( $("<div>", {id:"measure-wrapper-" + index, class:"measure parameter"}) );

    var finalFuckingName = "<p>" + param.name  + "</p><p> <span class='pull-left'>(MIN) " + myRange[0] + "</span> " + " <span class='pull-right'>" + myRange[myRange.length-1] + " (MAX)</span></p>";

    $("#measure-wrapper-" + index).append($("<p>", {class:"measure-name parameter-name text-center", html: finalFuckingName }));

    var sliderId = "measure-" + index;

    $("#measure-wrapper-" + index).append( $("<div>", {id: sliderId, class: "basic-slider measure-slider" }));
    
  
    var slider = noUISlider.create( $("#"+sliderId)[0], {
          start : [0],
          conect : true,
          tooltips : true,
          snap : false,
          range: sliderRange,
          disable: true,
          
    });

    $("#"+sliderId)[0].setAttribute('disabled', true);

    SPKMeasures.mySliders.push(slider);

  }

  SPKMeasures.setKey = function(key) {
    
    console.log(key);

    var mymeasures = "";
    var found = false;
    for(var i =0; i< SPKMeasures.kvpairs.length && !found; i++) {
      if(SPKMeasures.kvpairs[i].key === key) {
        mymeasures = SPKMeasures.kvpairs[i].values;
        found = true
      }
    }
  

    var mysplits = mymeasures.split(",");


    for( var i = 0; i < SPKMeasures.mySliders.length; i++ ) {

      SPKMeasures.mySliders[i].set(Number(mysplits[i]));
    }
  }

  SPKMeasures.getValuesForKey = function(key) {
    
    var mymeasures = null;
    var found = false;

    for(var i =0; i< SPKMeasures.kvpairs.length && !found; i++) {
    
      if(SPKMeasures.kvpairs[i].key === key) {
    
        mymeasures = SPKMeasures.kvpairs[i].values;
        found = true;
    
      }
    }
    return { measure: mymeasures, names : SPKMeasures.names } ;
  }
}

module.exports =  new SPKMeasures();