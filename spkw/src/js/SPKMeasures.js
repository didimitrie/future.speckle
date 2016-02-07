/*
 * Beta.Speckle Parametric Model Viewer
 * Copyright (C) 2016 Dimitrie A. Stefanescu (@idid) / The Bartlett School of Architecture, UCL
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of  MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 */



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

    for( var i = 0; i < SPKMeasures.data.length; i++ ) {
      SPKMeasures.createSlider(SPKMeasures.data[i], i);
    }

  }

  SPKMeasures.createSlider = function(param, index) {

    var myRange = param.values;
    myRange.sort(function(a,b) { return a-b});

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