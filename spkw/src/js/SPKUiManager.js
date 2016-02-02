//
//
//  THIS IS A CODE DUMP NEEDS PROPER THINKIN ABOOT
//
//


var $               = require('jquery');

var SPKUiManager = function () {
  
  var SPKUiManager = this;

  SPKUiManager.controlGroups = [];

  SPKUiManager.activeUi = null;

  SPKUiManager.init = function () {
    /**
     * SAVE CONTROLS
     */
    $("#spk-save-controls").on("click", function () {
      
      $("#spk-save-ui").toggleClass("hide-right-ui");
      
      $(this).toggleClass("hide-right");

      if($(this).hasClass("hide-right")) {
        $(this).html("<i class='fa fa-copy'></i>")

      }
      else{
        $(this).html("<i class='fa fa-angle-double-left'></i>")
        $(".instance-element").removeClass("active");
        
      }

    });

    $("#spk-measures-controls").on("click", function () {
      
      $("#spk-measures-ui").toggleClass("hide-right-ui");
      
      $(this).toggleClass("hide-right");

      if($(this).hasClass("hide-right")) 
        $(this).html("<i class='fa fa-area-chart'></i>")
      else{
        $(this).html("<i class='fa fa-angle-double-left'></i>")
        $(".instance-element").removeClass("active");
      }

    });

    /**
     * SETTINGS CONTROLS
     */
    
    $("#spk-settings-controls").on("click", function () {
      
      $("#spk-settings-ui").toggleClass("hide-right-ui");
      
      $(this).toggleClass("hide-right");

      if($(this).hasClass("hide-right")) 
        $(this).html("<i class='fa fa-cogs'></i>")
      else{
        $(this).html("<i class='fa fa-angle-double-left'></i>")
        $(".instance-element").removeClass("active");
      }

    });
  }

}

// he's global and unique
module.exports = new SPKUiManager();