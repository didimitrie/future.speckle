/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */


// General deps
var $               = require('jquery');
var THREE           = require('three');
var OrbitCtrls      = require('three-orbit-controls')(THREE);
var noUISlider      = require('nouislider');
var TWEEN           = require('tween.js');

// SPK "Core" Libs
var SPKLoader       = require('./SPKLoader.js');
var SPKMaker        = require('./SPKObjectMaker.js');
var SPKConfig       = require('./SPKConfig.js');

var events = require('./SPKPubSub.js');

var SPK = function ( options ) {
  
  var SPK = this;
  
  SPK.Options = null;
  /*************************************************
  /   SPK SPK.HMTLs
  *************************************************/

  SPK.HMTL = { 
    canvas : ""
  };

  /*************************************************
  /   SPK Vars
  *************************************************/
  
  SPK.META = {}
  SPK.PARAMS = {}

  SPK.GLOBALS = {
    model : "",
    metadata : {
      paramsFile : "",
      staticGeoFile : "",
      rootFiles : ""
    },
    sliders : [],
    currentKey : "",
    boundingSphere : ""
  }

  /*************************************************
  /   THREE vars
  *************************************************/

  SPK.VIEWER = {
    renderer : null,
    camera : null,
    scene : null, 
    controls : null,
    sunlight : null,
    raycaster : null,
  }
  

  SPK.SCENE = {
    grid : null,
    groundplane : null,
    shadowlight : null,
    shadows : true
  }

  SPK.takesScreenshot = false;

  /*************************************************
  /   SPK Methods
  *************************************************/
  
  SPK.init = function( options ) {

    SPK.Options = options;
    SPK.Options.lockCameraOnInstanceChange = false;

    // get those elements in place, you cunt
    SPK.HMTL.canvas         = $( "#" + options.canvasid );

    // get the model url
    var href = window.location.pathname;

    SPK.GLOBALS.model = href.substr(href.lastIndexOf('/') + 1);

    // need to init scene before: 
    // getmodel meta > load params > make scene > load static  & first instance (into scene) > 
    // > compute bounding box > setup environment > renderloop
    
    SPK.VIEWER.scene = new THREE.Scene();
    
    
    // load parameters && go!
    
    SPK.getModelInfo( function () {
      SPK.getModelMetadata( function ( defaultKey ) {
        SPK.loadInstance( defaultKey, function () {
         
          SPK.setupEnvironment();
          SPK.render(); 
          SPK.zoomExtents();
          
          if( options.onInitEnd !== undefined ) 
            options.onInitEnd( SPK )
        });      
      });
    });
  
  }

  SPK.getModelInfo = function(callback) {

    $.getJSON( SPKConfig.GEOMAPI + SPK.GLOBALS.model, function (data) {
      SPK.META = data;
      data.deflateLocation = data.deflateLocation.replace("./", "/");
      SPK.GLOBALS.metadata.paramsFile = SPKConfig.APPDIR + data.deflateLocation + "/metadata"
      SPK.GLOBALS.metadata.rootFiles = SPKConfig.APPDIR + data.deflateLocation + "/";

      if( callback !== undefined ) callback();
    })

  }

  SPK.getModelMetadata = function( callback ) {

    $.getJSON( SPK.GLOBALS.metadata.paramsFile, function( data ) {
      SPK.PARAMS = data;
      callback( data.kvpairs[0] );
    });

  }

  SPK.addNewInstance = function( key, callback ) { // TODO: only for compatibility reasons, should be cleaned up
    var notfound = true;
    for( var i = 0; i < SPK.PARAMS.kvpairs.length && notfound; i++) {
      if( SPK.PARAMS.kvpairs[ i ].key == key ) {
        found = true;
        SPK.loadInstance( SPK.PARAMS.kvpairs[ i ] );
      }
    }
  }

  SPK.findKvpByKey = function ( key ) {
    for (var i = SPK.PARAMS.kvpairs.length - 1; i >= 0; i--) {
      if(SPK.PARAMS.kvpairs[i].key === key) return SPK.PARAMS.kvpairs[i];
    }
    return null;
  }

  SPK.sceneDiff = function ( scene1, scene2 ) {

  }

  SPK.loadInstance = function( kvp, callback ) {
    SPK.GLOBALS.oldKey = SPK.GLOBALS.currentKey;
    SPK.GLOBALS.currentKey = kvp.key;
    
    var a = kvp.geometries; var oldkvp = SPK.findKvpByKey( SPK.GLOBALS.oldKey );
    var left = [], right = [], both = [];
    var geomsToLoad = kvp.geometries;

    // DIFF between scene objects
    if( oldkvp != null ) {
      var b = oldkvp.geometries;
      
      a.sort( function( a, b ) { return a - b } ); // fuck this
      b.sort( function( a, b ) { return a - b } );
      var left = [], right = [], both = [];

      var i = 0, j = 0;
      while (i < a.length && j < b.length) {
          if (a[i] < b[j]) {
              left.push(a[i]);
              ++i;
          } else if (b[j] < a[i]) {
              right.push(b[j]);
              ++j;
          } else {
              both.push(a[i]);
              ++i; ++j;
          }
      }
      while (i < a.length) {
          left.push(a[i]);
          ++i;
      }
      while (j < b.length) {
          right.push(b[j]);
          ++j;
      }      

      var out = [];

      for(var k = 0; k < SPK.VIEWER.scene.children.length; k++ )
        if( ( SPK.VIEWER.scene.children[ k ].removable ) && ( $.inArray( SPK.VIEWER.scene.children[ k ].spkId, right ) !== -1))
          out.push(SPK.VIEWER.scene.children[ k ]);

      SPK.fadeOut( out );
      geomsToLoad = left;
    }
    
    var geometryLoader = new THREE.JSONLoader();
    var results = [];

    for( var i = 0; i <  geomsToLoad.length; i++ ) {
      
      ( function( geomid, results ) {      
        var async = $.getJSON( SPK.GLOBALS.metadata.rootFiles + geomsToLoad[ i ], function ( data ) {
          
          var myg = geometryLoader.parse( data );
          myg.SPKLType = data.type;

          if( data.hasOwnProperty( "vertexColors" ) ) 
            myg.vertexColors = data.vertexColors;

          if( data.hasOwnProperty( "isClosed" ) )
            myg.isClosed = data.isClosed;

          SPKMaker.makeNL( myg, kvp.key, function ( threeObj ) {
            // woot
            threeObj.layer = data.parentGuid;
            threeObj.spkId = geomid; 
            threeObj.instanceName = kvp.key;

            SPK.VIEWER.scene.add( threeObj );
            SPK.fadeIn( [ threeObj ] );
          });   
        }); 
        results.push( async );
      } ) ( geomsToLoad[ i ], results );
    } // end for

    $.when.apply(this, results).done(function() {
        SPK.computeBoundingSphere();
        if( callback != null ) 
          callback();
    });
  
  }

  SPK.fadeIn = function ( objects ) {
      var duration = 420, opacity = 0.6; // TODO: SPK.Global props, check w/h material props
      var tweenIn = new TWEEN.Tween( { x : 0 } )
      .to( { x: opacity }, duration )
      .onUpdate( function() {
        for( var i = 0; i < objects.length; i++ ) {
          objects[i].material.opacity = this.x;
        }
      })

      tweenIn.start();
  }

  SPK.fadeOut = function ( objects ) {
    var opacity = 0.6, duration = 420; // TODO: SPK.Global props, check w/h material props
    var tweenOut = new TWEEN.Tween( { x: opacity } )
    .to( {x: 0}, duration )
    .onUpdate( function() {
      for( var i = 0; i < objects.length; i++ ) 
        objects[ i ].material.opacity = this.x;
    } )
    .onComplete( function() {
      for( var i = 0; i < objects.length; i++ ) {
        SPK.VIEWER.scene.remove( objects[ i ] );
        objects[ i ].geometry.dispose();
        objects[ i ].material.dispose();
      }
    } );
    tweenOut.start();
  }

  SPK.render = function() {

    requestAnimationFrame( SPK.render );

    TWEEN.update();

    SPK.VIEWER.renderer.render(SPK.VIEWER.scene, SPK.VIEWER.camera);

    if( SPK.takesScreenshot ) {
      SPK.takesScreenshot = false;
      var img = SPK.VIEWER.renderer.domElement.toDataURL();
      console.log( img ); 
      var image = new Image();
      image.src = img;
      var w = window.open("");
      w.document.write(image.outerHTML) 
    }

  }

  SPK.computeBoundingSphere = function() {
    var geometry = new THREE.Geometry();
    for(var i = 0; i < SPK.VIEWER.scene.children.length; i++) {
      //console.log( SPK.VIEWER.scene.children[i] );
      if(SPK.VIEWER.scene.children[i].selectable && SPK.VIEWER.scene.children[i].instance === SPK.GLOBALS.currentKey) {
        geometry.merge(SPK.VIEWER.scene.children[i].geometry);
      }
    }

    geometry.computeBoundingSphere();
    SPK.GLOBALS.boundingSphere = geometry.boundingSphere;
    geometry.dispose();
  }

  /*************************************************
  /   CONTEXT AND ENVIRONMENT
  *************************************************/

  SPK.setupEnvironment = function () {
    // TODO: Grids, etc.
    // make the scene + renderer

    var fov = 30; // default fov
    if( typeof SPK.Options.camerafov !== 'undefined' || SPK.Options.camerafov !== null )
      fov = SPK.Options.camerafov;

    var lightintensity = 0.4; // default light intensity
    if( typeof SPK.Options.lightintensity !== 'undefined' || SPK.Options.lightintensity !== null )
      lightintensity = SPK.Options.lightintensity;

    SPK.VIEWER.renderer = new THREE.WebGLRenderer( { antialias : true, alpha: true, } );

    SPK.VIEWER.renderer.setClearColor( 0xF2F2F2 ); 

    SPK.VIEWER.renderer.setPixelRatio( 1 );  // change to window.devicePixelRatio 
    
    SPK.VIEWER.renderer.setSize( $(SPK.HMTL.canvas).innerWidth(), $(SPK.HMTL.canvas).innerHeight() ); 

    SPK.VIEWER.renderer.shadowMap.enabled = true;
    SPK.VIEWER.renderer.shadowMap.type = THREE.PCFShadowMap;

    $(SPK.HMTL.canvas).append( SPK.VIEWER.renderer.domElement );

    SPK.VIEWER.camera = new THREE.PerspectiveCamera( fov, $(SPK.HMTL.canvas).innerWidth() * 1 / $(SPK.HMTL.canvas).innerHeight(), 1, SPK.GLOBALS.boundingSphere.radius * 100 );
    //SPK.VIEWER.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
    
    SPK.VIEWER.camera.position.z = -SPK.GLOBALS.boundingSphere.radius*1.8; 
    //SPK.VIEWER.camera.position.z = -30; 

    SPK.VIEWER.camera.position.y = SPK.GLOBALS.boundingSphere.radius*1.8;
    //SPK.VIEWER.camera.position.y = 30;
    
    SPK.VIEWER.controls = new OrbitCtrls( SPK.VIEWER.camera, SPK.VIEWER.renderer.domElement );

    SPK.VIEWER.controls.addEventListener( 'change', function () {
    });

    // shadow light
    var light = new THREE.SpotLight( 0xffffff, lightintensity );
    light.position.set(SPK.GLOBALS.boundingSphere.center.x + SPK.GLOBALS.boundingSphere.radius*3, SPK.GLOBALS.boundingSphere.center.y + SPK.GLOBALS.boundingSphere.radius*3, SPK.GLOBALS.boundingSphere.center.z + SPK.GLOBALS.boundingSphere.radius*5)
    light.target.position.set( SPK.GLOBALS.boundingSphere.center.x, SPK.GLOBALS.boundingSphere.center.y, SPK.GLOBALS.boundingSphere.center.z );
    light.castShadow = true;
    
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.shadowBias = -0.00001;
    light.shadowDarkness = 0.5;
    //light.position.set(SPK.GLOBALS.boundingSphere.center.x + SPK.GLOBALS.boundingSphere.radius * 1.7, SPK.GLOBALS.boundingSphere.center.y + SPK.GLOBALS.boundingSphere.radius * 3 ,SPK.GLOBALS.boundingSphere.center.z + SPK.GLOBALS.boundingSphere.radius * 1.7); 

    SPK.SCENE.shadowlight = light;
    SPK.VIEWER.scene.add(light);

    // camera light
    
    SPK.VIEWER.scene.add( new THREE.AmbientLight( 0xD8D8D8 ) );
   
    var flashlight = new THREE.PointLight( 0xCFCFCF, 0.8, SPK.GLOBALS.boundingSphere.radius * 12, 1);
    
    SPK.VIEWER.camera.add( flashlight );
    
    SPK.VIEWER.scene.add( SPK.VIEWER.camera );

    // grids
    
    SPK.makeContext();

    // resize events
    
    $(window).resize( function() { 
      
      SPK.VIEWER.renderer.setSize( $(SPK.HMTL.canvas).innerWidth()-1, $(SPK.HMTL.canvas).innerHeight()-5 ); 
      
      SPK.VIEWER.camera.aspect = ($(SPK.HMTL.canvas).innerWidth()-1) / ($(SPK.HMTL.canvas).innerHeight()-5);
      
      SPK.VIEWER.camera.updateProjectionMatrix();
    
    } );

    window.scene = SPK.VIEWER.scene;
    
  }

  SPK.makeContext = function() {

    var multiplier = 10;

    var planeGeometry = new THREE.PlaneGeometry( SPK.GLOBALS.boundingSphere.radius * multiplier * 2 , SPK.GLOBALS.boundingSphere.radius * multiplier * 2, 2, 2 ); //three.THREE.PlaneGeometry( width, depth, segmentsWidth, segmentsDepth );
    planeGeometry.rotateX( - Math.PI / 2 );
    var planeMaterial = new THREE.MeshBasicMaterial( { color: 0xEEEEEE } ); //0xEEEEEE #D7D7D7
    plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.position.set(SPK.GLOBALS.boundingSphere.center.x, -0.21, SPK.GLOBALS.boundingSphere.center.z );
    plane.visible = true;

    SPK.VIEWER.scene.add( plane );
    SPK.SCENE.plane = plane;
    
    if(SPK.GLOBALS.boundingSphere.radius === 0) 
    {
      console.error("ERR: Failed to calculate bounding sphere. This is a known bug and it happens when there's no valid geometry in the scene.");
    } 
    else {
      grid = new THREE.GridHelper( SPK.GLOBALS.boundingSphere.radius * multiplier, SPK.GLOBALS.boundingSphere.radius*multiplier/30);
      grid.material.opacity = 0.15;
      grid.material.transparent = true;
      grid.position.set(SPK.GLOBALS.boundingSphere.center.x, -0.2, SPK.GLOBALS.boundingSphere.center.z );
      grid.setColors( 0x0000ff, 0x808080 ); 
      SPK.VIEWER.scene.add( grid );
      SPK.SCENE.grid = grid;
   }
  
  }

  /*************************************************
  /   SPK CAMERA FUNC
  *************************************************/
  SPK.setCamera = function ( where ) {
    var cam = JSON.parse( where );

    SPK.VIEWER.camera.position.set(cam.position.x, cam.position.y, cam.position.z);
    SPK.VIEWER.camera.rotation.set(cam.rotation.x, cam.rotation.y, cam.rotation.z);

    SPK.VIEWER.controls.center.set(cam.controlCenter.x, cam.controlCenter.y, cam.controlCenter.z);
    SPK.VIEWER.controls.update();
  }

  SPK.setCameraTween = function ( where ) {
     var duration = 600;
     var cam = JSON.parse( where );

     new TWEEN.Tween( SPK.VIEWER.camera.position ).to( {
      x: cam.position.x,
      y: cam.position.y,
      z: cam.position.z
     }, duration ).onUpdate( function() {
      //SPK.VIEWER.controls.update(); // not needed as it seems to be enough to call it once in the last tween
     }).easing(TWEEN.Easing.Quadratic.InOut).start();

     new TWEEN.Tween( SPK.VIEWER.camera.rotation ).to( {
      x: cam.rotation.x,
      y: cam.rotation.y,
      z: cam.rotation.z
     }, duration ).onUpdate( function() {
      //SPK.VIEWER.controls.update();
     }).easing(TWEEN.Easing.Quadratic.InOut).start();

     new TWEEN.Tween( SPK.VIEWER.controls.center ).to( {
      x: cam.controlCenter.x,
      y: cam.controlCenter.y,
      z: cam.controlCenter.z
     }, duration ).onUpdate( function() {
      SPK.VIEWER.controls.update();
     }).easing(TWEEN.Easing.Quadratic.InOut).start();
  }
  
  SPK.zoomExtents = function () {
    var r = SPK.GLOBALS.boundingSphere.radius;
    var offset = r / Math.tan(Math.PI / 180.0 * SPK.VIEWER.controls.object.fov * 0.4);
    var vector = new THREE.Vector3(0, 0, 1);
    var dir = vector.applyQuaternion(SPK.VIEWER.controls.object.quaternion);
    var newPos = new THREE.Vector3();
    dir.multiplyScalar(offset * 1.05);    
    newPos.addVectors(SPK.GLOBALS.boundingSphere.center, dir);

    var futureLocation = { };
    futureLocation.position = newPos;
    futureLocation.rotation = SPK.VIEWER.controls.object.rotation.clone();
    futureLocation.controlCenter = SPK.GLOBALS.boundingSphere.center.clone();
    SPK.setCameraTween(JSON.stringify(futureLocation));
  }  

  /*************************************************
  /   SPK INIT
  *************************************************/
    
  SPK.init( options );

}

module.exports = SPK;

