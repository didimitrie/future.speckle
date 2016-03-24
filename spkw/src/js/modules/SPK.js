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

var SPK = function ( options ) {

  /*************************************************
  /   SPK Global
  *************************************************/
  
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
  /*************************************************
  /   SPK Methods
  *************************************************/
  
  /**
   * Main Init Function
   */
  
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
    
    SPK.getModelMeta( function () {

      SPK.loadParameters( function ( firstKey ) {

        SPK.addNewInstance( firstKey, function () {

          SPK.loadStaticInstance();
          SPK.setupEnvironment();
          SPK.render(); 
          SPK.zoomExtents();

          if( options.onInitEnd !== undefined ) options.onInitEnd( SPK )

        });      
      });
    });

  }

  SPK.getModelMeta = function(callback) {

    $.getJSON(SPKConfig.GEOMAPI + SPK.GLOBALS.model, function (data) {
      
      SPK.META = data;

      data.deflateLocation = data.deflateLocation.replace("./", "/");
      
      SPK.GLOBALS.metadata.paramsFile = SPKConfig.APPDIR + data.deflateLocation + "/params.json"
      SPK.GLOBALS.metadata.staticGeoFile = SPKConfig.APPDIR + data.deflateLocation + "/static.json"
      SPK.GLOBALS.metadata.rootFiles = SPKConfig.APPDIR + data.deflateLocation + "/";

      if( callback !== undefined ) callback();
    })

  }

  // Loads the parameters file and passen on to call back the first key to load
  // Used only in init
  SPK.loadParameters = function(callback) {

    $.getJSON( SPK.GLOBALS.metadata.paramsFile, function(data) {
      SPK.PARAMS = data;
      callback( data.kvpairs[0].key );
    });

  }


  SPK.fadeIn = function ( objects ) {
      var duration = 300, opacity = 0.95;
      
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

    var opacity = 0.95, duration = 300;
    
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

  SPK.purgeScene = function() {
    
    // theoretically should do nothing; but we do have cases when we have overlapping instances
    // due to "quickness" of slider drag, and the way we handle object loading. yoop. 

    var out = [];
    
    for(var i = 0; i < SPK.VIEWER.scene.children.length; i++ ) {
      var myObj = SPK.VIEWER.scene.children[i];
      if( (myObj.removable) && (myObj.instance != SPK.GLOBALS.currentKey) )
          out.push(myObj);
    }

    SPK.fadeOut( out )
  }

  // 
  SPK.addNewInstance = function( key, callback ) {

    if(SPK.GLOBALS.currentKey === key) 
      return;
    
    SPK.GLOBALS.currentKey = key;
    SPK.purgeScene();

    SPK.loadInstance( key, function() {

      var iin = [];
      for(var i = 0; i < SPK.VIEWER.scene.children.length; i++ ) {
        
        var myObj = SPK.VIEWER.scene.children[i];
        
        if( myObj.removable && ( myObj.instance === SPK.GLOBALS.currentKey ) ) 
          iin.push(myObj);

      }

      SPK.fadeIn( iin );

      if( callback !== undefined ) callback();
      if( SPK.Options.onInstanceChange !== undefined) SPK.Options.onInstanceChange( SPK.PARAMS, key);

    });

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

  // Wrapper and parser
  
  SPK.loadParallelInstance = function ( data ) {
    var instanceKey = "";
    var k = 0;
    for (var property in data) 
         if (data.hasOwnProperty(property)) 
            if(++k <= SPK.PARAMS.parameters.length) instanceKey += data[property] + ",";

    SPK.addNewInstance( instanceKey );
  }

  // Tells file.json > SPKLoader > SPKMaker > objects > adds them to scene
  // Initial opacity is set to 0 so new objs can be fadedIn
 
  SPK.loadInstance = function(key, callback) {

    SPKLoader.load( SPK.GLOBALS.metadata.rootFiles + key + ".json", function ( obj ) {

      for( var i = 0; i < obj.geometries.length; i++ ) {

        SPKMaker.make( obj.geometries[i], key, function( obj ) { 
          
          SPK.VIEWER.scene.add(obj);

        });

      }

      SPK.computeBoundingSphere();

      if( callback != undefined )

        callback();

    });

  }

  SPK.loadStaticInstance = function() {

    SPKLoader.load( SPK.GLOBALS.metadata.staticGeoFile, function( obj ) {

      for( var i = 0; i < obj.geometries.length; i++ ) {

        SPKMaker.make(obj.geometries[i], "static", function( obj ) { 
          
          // TODO : Make unremovable
          
          obj.removable = false;

          obj.material.opacity = 1;
          
          SPK.VIEWER.scene.add(obj);
          
        });

      }

    });

  }

  SPK.render = function() {

    requestAnimationFrame( SPK.render );

    TWEEN.update();

    SPK.VIEWER.renderer.render(SPK.VIEWER.scene, SPK.VIEWER.camera);

  }

  SPK.setupEnvironment = function () {
    // TODO: Grids, etc.
    // make the scene + renderer

    var fov = 30; // default fov
    if( typeof SPK.Options.camerafov !== 'undefined' || SPK.Options.camerafov !== null )
      fov = SPK.Options.camerafov;

    var lightintensity = 0.4; // default light intensity
    if( typeof SPK.Options.lightintensity !== 'undefined' || SPK.Options.lightintensity !== null )
      lightintensity = SPK.Options.lightintensity;

    SPK.VIEWER.renderer = new THREE.WebGLRenderer( { antialias : true, alpha: true} );

    SPK.VIEWER.renderer.setClearColor( 0xF2F2F2 ); 

    SPK.VIEWER.renderer.setPixelRatio( 1 );  // change to window.devicePixelRatio 
    
    SPK.VIEWER.renderer.setSize( $(SPK.HMTL.canvas).innerWidth(), $(SPK.HMTL.canvas).innerHeight() ); 

    SPK.VIEWER.renderer.shadowMap.enabled = true;
    SPK.VIEWER.renderer.shadowMap.type = THREE.PCFShadowMap;

    $(SPK.HMTL.canvas).append( SPK.VIEWER.renderer.domElement );

    SPK.VIEWER.camera = new THREE.PerspectiveCamera( fov, $(SPK.HMTL.canvas).innerWidth() * 1 / $(SPK.HMTL.canvas).innerHeight(), 1, SPK.GLOBALS.boundingSphere.radius * 100 );
    //SPK.VIEWER.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
    
    SPK.VIEWER.camera.position.z = -SPK.GLOBALS.boundingSphere.radius*1.8; 

    SPK.VIEWER.camera.position.y = SPK.GLOBALS.boundingSphere.radius*1.8;
    
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

    if(SPK.GLOBALS.boundingSphere.radius === 0) {
      console.error("ERR: Failed to calculate bounding sphere. This is a known bug and it happens when there's no valid geometry in the scene.");
      //$(".model-name").append(
      $(SPK.HMTL.sliders).html(
      "<br><p style='color: red'>Failed to load model. <strong>Check the console for details (if you feel like a hacker), and send a shout over to <a href='mailto:contact@dimitrie.org?subject=Model " + SPK.GLOBALS.model + " failed to load'>contact@dimitrie.org.</a> so we can look into it. Thanks!</p>")
    } else {
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

  /*************************************************
  /   SPK CAMERA FUNC
  *************************************************/
  
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

  SPK.beep = function () {
    return "boop"; // THE MOST AMAZING FUNCTION 3V3R
  }


  /*************************************************
  /   SPK INIT
  *************************************************/
    
  SPK.init( options );

}

module.exports = SPK;

