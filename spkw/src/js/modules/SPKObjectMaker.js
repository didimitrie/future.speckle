/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
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

      SPKObjectMaker.makeMesh( data.geometry, key, callback);

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

  SPKObjectMaker.makeNL = function( data, key, callback) {

    if( data.SPKLType === 'SPKL_Mesh' ) 

      SPKObjectMaker.makeMesh( data.geometry, key, callback);

    else
    
    if( data.SPKLType === 'SPKL_ColorMesh' ) 
    
      SPKObjectMaker.makeColorMesh( data.geometry, data.vertexColors, key, callback );
    
    else 

    if( data.SPKLType === 'SPKL_Polyline' )

      SPKObjectMaker.makePolyline( data.geometry, key, callback );

    else 

    if( data.SPKLType === 'SPKL_Point' )

      SPKObjectMaker.makePoint( data.geometry, key, callback );

    else {}

      //console.warn( "ERR_MAKE: Unidentified type encountered: " + data.SPKLType );
  }

  /**
   * Specialised Maker Functions 
   */

  SPKObjectMaker.makeMesh = function( data, key, callback ) {

    var material = new THREE.MeshPhongMaterial( { color: 0xBABABA, specular: 0xD1ECFF, shininess: 10, shading: THREE.FlatShading } );
    //var material = new THREE.MeshNormalMaterial();
    
    material.side = THREE.DoubleSide; material.transparent = true; material.opacity = 0;

    var myObj = new THREE.Mesh(data, material);
    
    myObj.castShadow = true; myObj.receiveShadow = true;

    myObj.geometry.computeFaceNormals(); myObj.geometry.computeVertexNormals();

    myObj.selectable = true; myObj.removable = true; 

    myObj.instance = key;

    var myEdges = new THREE.EdgesHelper( myObj, 0xA1A1A1, 30 );
    
    myEdges.removable = true; myEdges.material.transparent = true;
    
    myEdges.instance = key;

    // am not sure this is a good way to deal with two objs
    callback( myObj );
    callback( myEdges );
  }

  SPKObjectMaker.makeColorMesh = function( data, vertexColors, key, callback ) {
    
    for( var i=0 ; i < data.faces.length ; i++ ) {
      
      data.faces[i].vertexColors.push( new THREE.Color( vertexColors[data.faces[i].a] ) )
      
      data.faces[i].vertexColors.push( new THREE.Color( vertexColors[data.faces[i].b] ) )
      
      data.faces[i].vertexColors.push( new THREE.Color( vertexColors[data.faces[i].c] ) )  
    }

    var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

    material.side = 2; material.transparent = true; 

    var myObj = new THREE.Mesh( data, material );

    myObj.castShadow = true; myObj.receiveShadow = true;

    myObj.geometry.computeFaceNormals(); myObj.geometry.computeVertexNormals();

    myObj.selectable = true; myObj.removable = true; 

    myObj.instance = key;

    var myEdges = new THREE.EdgesHelper( myObj, 0xA1A1A1, 30 );
    
    myEdges.removable = true; myEdges.material.transparent = true;
    
    myEdges.instance = key;

    if( callback != undefined )

      callback( myObj );
      callback( myEdges );
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