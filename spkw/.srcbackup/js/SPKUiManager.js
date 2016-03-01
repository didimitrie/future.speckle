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