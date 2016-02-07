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



var $           = require('jquery');

var SPKSync = function () {

  var SPKSync = this;

  SPKSync.instances = [];
  SPKSync.pause = false;

  SPKSync.addInstance = function (instance) {

    SPKSync.instances.push(instance);

    $(".toggle-grid").on("click", SPKSync.toggleGrid);
    $(".toggle-ground-shadows").on("click", SPKSync.toggleGroundShadows);
    $(".toggle-zoom").on("click", SPKSync.zoomExtents);

  }

  SPKSync.syncCamera = function (camera) {

    for( var  i = 0; i < SPKSync.instances.length; i++ ) {

      if( camera != SPKSync.instances[i].VIEWER.camera ) {
        
        var camToSync = SPKSync.instances[i].VIEWER.camera;

        camToSync.position.x = camera.position.x;
        camToSync.position.y = camera.position.y;
        camToSync.position.z = camera.position.z;
        
        camToSync.quaternion._w = camera.quaternion._w;
        camToSync.quaternion._x = camera.quaternion._x;
        camToSync.quaternion._y = camera.quaternion._y;
        camToSync.quaternion._z = camera.quaternion._z;

        camToSync.updateProjectionMatrix();
      }
    }

  }
  
  SPKSync.zoomExtents = function() {
    
    for( var  i = 0; i < SPKSync.instances.length; i++ ) {
      
      SPKSync.instances[i].zoomExtents();

    }

  }  

  SPKSync.toggleGroundShadows = function() {
    SPKSync.toggleShadows();
    SPKSync.toggleGroundplane();
  }

  SPKSync.toggleShadows = function() {
    
    for( var  i = 0; i < SPKSync.instances.length; i++ ) {
      console.log(i + " / " + SPKSync.instances[i].SCENE.shadows);
      if( SPKSync.instances[i].SCENE.shadows ) {
        SPKSync.instances[i].SCENE.shadowlight.shadowDarkness = 0;
        SPKSync.instances[i].SCENE.shadows = false;
      }
      else {
        SPKSync.instances[i].SCENE.shadowlight.shadowDarkness = 0.15;
        SPKSync.instances[i].SCENE.shadows = true;
      }

    }

  }

  SPKSync.toggleGrid = function() {
    
    for( var  i = 0; i < SPKSync.instances.length; i++ ) {
      
      SPKSync.instances[i].SCENE.grid.visible = ! SPKSync.instances[i].SCENE.grid.visible;

    }

  }

  SPKSync.toggleGroundplane = function () {

    for( var  i = 0; i < SPKSync.instances.length; i++ ) {
      
      SPKSync.instances[i].SCENE.plane.visible = ! SPKSync.instances[i].SCENE.plane.visible;

    }

  }

  // centralising key presses in SPKSync 
  // Allows for distributed control events to all poss instances


  $(document).keyup(function(e) {

    if(SPKSync.pause) return;

    if(e.keyCode == 71) 
      SPKSync.toggleGrid();

    if(e.keyCode == 83)
      {SPKSync.toggleShadows();SPKSync.toggleGroundplane();}

    if(e.keyCode == 32) 
      SPKSync.zoomExtents();

  });



}

module.exports = new SPKSync();