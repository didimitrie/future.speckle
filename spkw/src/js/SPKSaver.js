
var $               = require('jquery');
var SPKUiManager    = require('./SPKUiManager');
var SPKConfig       = require('./SPKConfig.js');

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
        alert("Please add a description.")
        return;
      }
      
      $(SPKSaver.HTML.form).find("textarea").val("");

      $.post(SPKConfig.INSTAPI, dataToSubmit, function(data) {

        SPKSaver.refreshList();

      })

    });

    SPKSaver.refreshList();

    SPKUiManager.addGroup(SPKSaver.HTML.wrapper, "saving-ui", "fa-comments", false);

  }

  SPKSaver.refreshList = function () {
    
    $(SPKSaver.HTML.list).html("");
    
    $.post(SPKConfig.INSTAPI, { type: "getsavedinstances", model: SPKSaver.SPK.GLOBALS.model}, function(data){
   
        data = data.reverse();
   
        if(data.length)
   
          for( var i = 0; i < data.length; i++ ) {
   
            SPKSaver.createInstance( data[i], i );
   
          }
   
        else 
   
          $(SPKSaver.HTML.list).append("<h3 class='text-center'> There are no saved configurations. Add one!</h3>")
   
    });
  
  }

  SPKSaver.createInstance = function (instance, index) {
    
    $(SPKSaver.HTML.list).append( $("<div>", { id: "instance-" + index, class: "instance-element", html: "<p class='description'>" + instance.description + "</p>"}) );
    
    $( "#instance-" + index ).append( "<p class='key'>" + SPKSaver.parseKeyName( instance.key, index ) + "</p>");

    $( "#instance-" + index ).attr( "spk-inst", instance.key );
    
    // behaviour
    $( "#instance-" + index ).click( function () {

      var myKey = $( this ).attr( "spk-inst" );

      SPKSaver.SPK.loadInstanceForced(myKey);

      $(".instance-element").removeClass("active");

      $(this).addClass("active");
      
    });

  }

  SPKSaver.parseKeyName = function (key, index) {

    var params = key.split(",");

    var fullname = "";

    for( var i = 0; i < params.length - 1; i++ ) {
      
      fullname += SPKSaver.SPK.GLOBALS.sliders[i].paramName;
      
      fullname += ": <strong>" + params[i] + "</strong> ";

    }
    
    return fullname;

  }

}

// make it unique across all instances
module.exports = new SPKSaver();