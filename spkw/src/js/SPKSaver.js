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
var SPKUiManager    = require('./SPKUiManager');
var SPKConfig       = require('./SPKConfig.js');
var SPKSync         = require('./SPKSync.js');
var SPKMeasures     = require('./SPKMeasures');

var SPKSaver = function (wrapper) {
  
  var SPKSaver = this;
  
  SPKSaver.HTML = {
    wrapper: "",
    list : "",
    saveform: ""
  }

  SPKSaver.SPK = "";
  SPKSaver.paramNames = [];

  SPKSaver.init = function (SPKInstance) {
    
    SPKSaver.HTML.wrapper = $("#wrapper-saver");
    SPKSaver.HTML.form = $(SPKSaver.HTML.wrapper).find("form");
    SPKSaver.HTML.list = $(SPKSaver.HTML.wrapper).find("#instance-list");

    SPKSaver.SPK = SPKInstance;

    $(SPKSaver.HTML.form).find("textarea").focusin( function () {
      SPKSync.pause = true;
    }) 

    $(SPKSaver.HTML.form).find("textarea").focusout( function () {
      SPKSync.pause = false;
    })

    $(SPKSaver.HTML.form).find("textarea").keypress(function(event) {
      if (event.which == 13) {
          event.preventDefault();
          $(SPKSaver.HTML.form).submit();
      }
    });

    $(SPKSaver.HTML.form).on("submit", function (e) {

      e.preventDefault();

      var dataToSubmit = {
        type : "addnew",
        model: SPKSaver.SPK.GLOBALS.model, 
        key : SPKSaver.SPK.GLOBALS.currentKey,
        description: $(SPKSaver.HTML.form).find("textarea").val(),
        camerapos: { x: SPKSaver.SPK.VIEWER.camera.position.x, y: SPKSaver.SPK.VIEWER.camera.position.y, z: SPKSaver.SPK.VIEWER.camera.position.z }
      }
      
      if(dataToSubmit.description === "") {
        return;
      }
      
      $(SPKSaver.HTML.form).find("textarea").val("");

      $.post(SPKConfig.INSTAPI, dataToSubmit, function(data) {

        SPKSaver.refreshList();

      })

    });

    SPKSaver.refreshList();

  }

  SPKSaver.refreshList = function () {
    
    $(SPKSaver.HTML.list).html("");
    
    $.post(SPKConfig.INSTAPI, { type: "getsavedinstances", model: SPKSaver.SPK.GLOBALS.model}, function(data){
        
        data = data.reverse();
   
        if(data.length) {
   
          for( var i = 0; i < data.length; i++ ) {
   
            SPKSaver.createInstance( data[i], i );
   
          }

          $(".model-comments").text("There are " + data.length + " saved configurations.");
          

        } else {
   
          $(SPKSaver.HTML.list).append("<h3 class='text-center'> There are no saved configurations. Add one!</h3>")
        }

    });
  
  }

  SPKSaver.createInstance = function (instance, index) {
    
    $(SPKSaver.HTML.list).append( $("<div>", { id: "instance-" + index, class: "instance-element", html: "<p class='description'>" + instance.description + "</p>"}) );
    
    $( "#instance-" + index ).append( "<p class='key'>" + SPKSaver.parseKeyName( instance.key, index ) + "</p>");

    $( "#instance-" + index ).attr( "spk-inst", instance.key );
    $( "#instance-" + index ).attr( "spk-inst-index", index );
    
    // behaviour
    $( "#instance-" + index ).click( function () {

      var myKey = $( this ).attr( "spk-inst" );

      SPKSaver.SPK.loadInstanceForced(myKey);

      $(".instance-element.active").removeClass("active");

      $(this).addClass("active");
      
    });

  }

  SPKSaver.parseKeyName = function (key, index) {

    var params = key.split(",");

    var fullname = "<div class='spk-saver-half'><p><strong>Input parameters:</strong></p><p>";

    for( var i = 0; i < params.length - 1; i++ ) {
      
      if(SPKSaver.SPK.GLOBALS.sliders[i].paramName != "") fullname += SPKSaver.SPK.GLOBALS.sliders[i].paramName;
      else fullname += "Unnamed parameter";
      
      fullname += ": <strong>" + params[i] + "</strong><br> ";

    }
      

    var measures = SPKMeasures.getValuesForKey(key);

    var splitmeausres = measures.measure.split(",");

    fullname += " </p></div> <div class='spk-saver-half'><p><strong>Performance measures:</strong></p><p>"

    for( var i = 0; i < splitmeausres.length - 1; i++ ) {
      
      fullname += measures.names[i]
      
      fullname += ": <strong>" + splitmeausres[i] + "</strong><br> ";

    }

    fullname += "</p></div><div class='clear'></div>"

    return fullname;  

  }

}

// make it unique across all instances
module.exports = new SPKSaver();