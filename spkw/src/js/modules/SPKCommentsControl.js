/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */


var $               = require('jquery');
var shortid         = require('shortid');
var SPKConfig       = require('./SPKConfig.js');
var THREE           = require('three');

var SPKCommentsControl = function ( options ) {

  var SPKCommentsControl = this;
  SPKCommentsControl.data = {}
  SPKCommentsControl.SPK = {}
  SPKCommentsControl.id = shortid.generate()
  SPKCommentsControl.Wrapper = {} 
  SPKCommentsControl.form = {}
  SPKCommentsControl.list = {}
  SPKCommentsControl.Data = []

  SPKCommentsControl.init = function ( options ) {

    SPKCommentsControl.data = options.data;
    SPKCommentsControl.SPK = options.spk;
    SPKCommentsControl.Wrapper = $( "#" + options.wrapperid );
    SPKCommentsControl.form = $( "#" + options.formid );
    SPKCommentsControl.list = $(SPKCommentsControl.Wrapper).find( "#instance-list" );

    $( SPKCommentsControl.Wrapper ).attr( "spktabid", SPKCommentsControl.id );

    var uitabs = $( "#" + options.uitabid);
    var icon = "<div class='icon' spkuiid='" + SPKCommentsControl.id + "'><span class='hint--right' data-hint='Saved Instances'><i class='fa " + options.icon + "'></span></div>";
    
    $( uitabs ).append( icon );

    $( "[spkuiid='" + SPKCommentsControl.id + "']").click( function() {
      $( "#spk-ui-tabs").find(".icon").removeClass( "icon-active" );
      $( this ).addClass( "icon-active" );

      $( ".sidebar" ).addClass( "sidebar-hidden" );
      $( "[spktabid='"+ SPKCommentsControl.id + "']").removeClass( "sidebar-hidden" );
    } )

    //hacky
    $( "#spk-save-widget" ).find( ".save-config" ).click( function () { 

      $( "#spk-save-widget" ).find( "form" ).toggleClass( "closed" );
      
      if(! $( "#spk-save-widget" ).find( "form" ).hasClass( "closed" ) ) 
        $( "#spk-save-widget" ).find( "input" ).focus();
    } )

    // set up form submit and key press ease
    $(SPKCommentsControl.form).find( "input" ).keypress(function(event) {
      if (event.which == 13) {
          event.preventDefault();
          $(SPKCommentsControl.form).submit();
          $(SPKCommentsControl.form).addClass("closed");
      }
    });

    // form submitting event: 
    $( SPKCommentsControl.form ).on( "submit", function ( e ) {
      e.preventDefault();

      var camToSave = { };
      camToSave.position = SPKCommentsControl.SPK.VIEWER.controls.object.position.clone();
      camToSave.rotation = SPKCommentsControl.SPK.VIEWER.controls.object.rotation.clone();
      camToSave.controlCenter = SPKCommentsControl.SPK.VIEWER.controls.center.clone();

      console.log( JSON.stringify(camToSave) );

      var dataToSubmit = {
        type : "addnew",
        model: SPKCommentsControl.SPK.GLOBALS.model, 
        key : SPKCommentsControl.SPK.GLOBALS.currentKey,
        description: $(SPKCommentsControl.form).find("input").val(),
        camerapos: JSON.stringify(camToSave)
      }
      
      if(dataToSubmit.description === "") {
        return;
      }
      
      $(SPKCommentsControl.form).find("input").val("");

      $.post(SPKConfig.INSTAPI, dataToSubmit, function(data) {
        SPKCommentsControl.refreshList();
      })

    });

    SPKCommentsControl.refreshList(); 
  }

  SPKCommentsControl.refreshList = function () {
    
    $(SPKCommentsControl.list).html("");
    
    $.post(SPKConfig.INSTAPI, { type: "getsavedinstances", model: SPKCommentsControl.SPK.GLOBALS.model}, function( data ) {
        data = data.reverse();
        SPKCommentsControl.Data = data;

        if(data.length) { 
          for( var i = 0; i < data.length; i++ ) {
            SPKCommentsControl.createInstance( data[i], i );
          }
          $(".model-comments").text("There are " + data.length + " saved configurations.");
        } else 
          $(SPKCommentsControl.list).append("<h3 class='text-center'> There are no saved configurations. Add one!</h3>")        
    });  
  }

  SPKCommentsControl.createInstance = function (instance, index) {
    
    $(SPKCommentsControl.list).append( $("<div>", { id: "instance-" + index, class: "instance-element", html: "<p class='description'>" + instance.description + "</p>"}) );
    
    $( "#instance-" + index ).append( "<p class='key'>" + SPKCommentsControl.parseKeyName( instance.key, index ) + "</p>");

    $( "#instance-" + index ).attr( "spk-inst", instance.key );
    $( "#instance-" + index ).attr( "spk-inst-index", index );
    
    // behaviour
    $( "#instance-" + index ).click( function () {

      var myKey = $( this ).attr( "spk-inst" );

      SPKCommentsControl.SPK.addNewInstance( myKey );
      var camerapos = "";
      camerapos = SPKCommentsControl.Data[ $( this ).attr( "spk-inst-index" )].camerapos;

      if( camerapos != undefined )
        SPKCommentsControl.SPK.setCameraTween( SPKCommentsControl.Data[ $( this ).attr( "spk-inst-index" )].camerapos );

      $(".instance-element.active").removeClass("active");

      $(this).addClass("active");
      
    });

  }

  SPKCommentsControl.parseKeyName = function ( key ) {

    var params = key.split(",");
    var fullname = "<div class='spk-saver-half'><p><strong>Input parameters:</strong></p><p>";

    for( var i = 0; i < params.length - 1; i++ ) {
      
      if(SPKCommentsControl.data.parameters[i].name != "") 
        fullname += SPKCommentsControl.data.parameters[i].name;
      else
        fullname += "Unnamed parameter";
      
      fullname += ": <strong>" + params[i] + "</strong><br> ";

    }
      

    var measures = SPKCommentsControl.getValuesForKey(key);

    var splitmeausres = measures.measure.split(",");

    fullname += " </p></div> <div class='spk-saver-half'><p><strong>Performance measures:</strong></p><p>"

    for( var i = 0; i < splitmeausres.length - 1; i++ ) {
      fullname += measures.names[i]
      fullname += ": <strong>" + splitmeausres[i] + "</strong><br> ";
    }

    fullname += "</p></div><div class='clear'></div>"
    return fullname;  
  }

  SPKCommentsControl.getValuesForKey = function(key) {
    
    var mymeasures = null;
    var found = false;
    
    for(var i =0; i < SPKCommentsControl.data.kvpairs.length && !found; i++) {
    
      if(SPKCommentsControl.data.kvpairs[i].key === key) {
    
        mymeasures = SPKCommentsControl.data.kvpairs[i].values;
        found = true;
    
      }
    }
    return { measure: mymeasures, names : SPKCommentsControl.data.propNames } ;
  }

  SPKCommentsControl.init( options );
}

module.exports = SPKCommentsControl;