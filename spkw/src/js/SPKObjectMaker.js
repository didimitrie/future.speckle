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


/*
  Makes THREE objects from THREE geometry, adding some sugar in between
 */

var THREE = require('three');

var SPKObjectMaker = function() {

  // scope scope scope
  var SPKObjectMaker = this;

  /**
   * CENTRAL DISTRIBUTION UNIT
   */
  
  SPKObjectMaker.make = function( data, key, callback) {

    if( data.SPKLType === 'SPKL_Mesh' ) 

      SPKObjectMaker.makeMesh( data, key, callback);

    else
    
    if( data.SPKLType === 'SPKL_ColorMesh' ) 
    
      SPKObjectMaker.makeColorMesh( data, key, callback );
    
    else 

    if( data.SPKLType === 'SPKL_Polyline' )

      SPKObjectMaker.makePolyline( data, key, callback );

    else 

    if( data.SPKLType === 'SPKL_Point' )

      SPKObjectMaker.makePoint( data, key, callback );

    else {}

      //console.warn( "ERR_MAKE: Unidentified type encountered: " + data.SPKLType );
  }

  /**
   * Specialised Maker Functions 
   */

  SPKObjectMaker.makeMesh = function( data, key, callback ) {

    var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0xD1ECFF, shininess: 30, shading: THREE.FlatShading } );
    //var material = new THREE.MeshNormalMaterial();
    
    material.side = THREE.DoubleSide; material.transparent = true; material.opacity = 0;

    var myObj = new THREE.Mesh(data, material);
    
    myObj.castShadow = true; myObj.receiveShadow = true;

    myObj.geometry.computeFaceNormals(); myObj.geometry.computeVertexNormals();

    myObj.selectable = true; myObj.removable = true; 

    myObj.instance = key;

    var myEdges = new THREE.EdgesHelper( myObj, 0x4D4D4D, 30 );
    
    myEdges.removable = true; myEdges.material.transparent = true;
    
    myEdges.instance = key;

    // am not sure this is a good way to deal with two objs
    callback( myObj );
    callback( myEdges );
  }

  SPKObjectMaker.makeColorMesh = function( data, key, callback ) {
    
    for( var i=0 ; i < data.faces.length ; i++ ) {
      
      data.faces[i].vertexColors.push( new THREE.Color( data.vertexColors[data.faces[i].a] ) )
      
      data.faces[i].vertexColors.push( new THREE.Color( data.vertexColors[data.faces[i].b] ) )
      
      data.faces[i].vertexColors.push( new THREE.Color( data.vertexColors[data.faces[i].c] ) )  
    }

    var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

    material.side = 2; material.transparent = true; 

    var myObj = new THREE.Mesh( data, material );

    myObj.castShadow = true; myObj.receiveShadow = true;

    myObj.geometry.computeFaceNormals(); myObj.geometry.computeVertexNormals();

    myObj.selectable = true; myObj.removable = true; 

    myObj.instance = key;

    // TODO : Mesh edges for the colourful meshes

    if( callback != undefined )

      callback( myObj );
  }


  SPKObjectMaker.makePolyline = function( data, key, callback ) {

    var material = new THREE.LineBasicMaterial( { color : 0x97C3FF } ); //#
    
    material.transparent = true;

    if( data.isClosed ) 
    
      data.vertices.push( data.vertices[0] );

    var myObj = new THREE.Line(data, material);
    
    myObj.removable = true; myObj.selectable = true; myObj.instance = key;

    if( callback != undefined )

      callback( myObj );
  }


  SPKObjectMaker.makePoint = function( data, key, callback ) {

    var material = new THREE.PointsMaterial( { color : 0x0000FF, size : 1 } );
    
    material.transparent = true;

    var myObj = new THREE.Points(data, material);
    
    myObj.removable = true; myObj.selectable = true; myObj.instance = key;

    if( callback != undefined ) 

      callback( myObj );
  }

  SPKObjectMaker.makeNamedViews = function() {
    // TODO
  }
}

module.exports = new SPKObjectMaker();