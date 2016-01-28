
var $               = require('jquery');

var SPKUiManager = function () {
  
  var SPKUiManager = this;

  SPKUiManager.controlGroups = [];

  SPKUiManager.activeUi = null;

  SPKUiManager.init = function () {

    $(SPKUiManager.controlGroups[0].tag).addClass("active");
    
    // center the tags
    var diff = window.innerHeight - $("#spk-ui-controls").height();
 
    //$("#spk-ui-controls").css("top", diff/2-20 + "px");
    //$("#spk-ui-controls").css("top", -20 + "px");

    // center the wrappers
    for( var i = 0; i < SPKUiManager.controlGroups.length; i++ ) {
      
      var myGroup =  SPKUiManager.controlGroups[i];

      if( myGroup.center ) {
        var wrpHeight = $(myGroup.html).height();
        var sdbHeight = $(myGroup.html).parent().height();

        var diff = sdbHeight - wrpHeight;
        //$(myGroup.html).css("top", diff/2 + "px");
      }
    }

  }

  SPKUiManager.centerWrapper = function (groupName) {
    for( var i = 0; i < SPKUiManager.controlGroups.length; i++ ) {
          
          var myGroup =  SPKUiManager.controlGroups[i];

          if(myGroup.name === groupName ) {

            var diff = $(myGroup.html).parent().height() - $(myGroup.html).height();
            
            $(myGroup.html).css("top", diff/2 + "px");

          }
        }
  }
  
  SPKUiManager.sortOut = function () {
    
    var myName = $(this).attr("id").replace("tag-","");
    
    for( var i = 0; i < SPKUiManager.controlGroups.length; i++ ) {
      
      var myGroup =  SPKUiManager.controlGroups[i];
      
      if( myGroup.name === myName ) {
        $(myGroup.tag).addClass("active");
        $(myGroup.html).removeClass("hidden");
      } else {
        $(myGroup.tag).removeClass("active");
        $(myGroup.html).addClass("hidden");
      }

    }

  }

  SPKUiManager.addGroup = function ( htmlwrapper, name, icon, center ) {
    
    var myGroup = {
      html : htmlwrapper,
      tag : "",
      name : name,
      groupicon : icon,
      center: center
    }

    SPKUiManager.controlGroups.push( myGroup );

    $("#spk-ui-controls").append(
      $("<div>", { 
        id: "tag-" + myGroup.name,
        html: "<i class='fa " + icon + "'></i>",
        class: "tag",
        on: {
          click: SPKUiManager.sortOut,
        }
      })
    );

    myGroup.tag = $("#tag-" + myGroup.name);

  }


}

// he's global and unique
module.exports = new SPKUiManager();