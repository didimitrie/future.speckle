
// (C) 2016 Dimitrie A. Stefanescu
// License: GNU GPL v3.0

// general deps
var $           = require('jquery');
var THREE       = require('three');
var OrbitCtrls  = require('three-orbit-controls')(THREE);
var noUISlider  = require('nouislider');
var TWEEN       = require('tween.js');

// SPK Libs
var SPKLoader   = require('./SPKLoader.js');
var SPKCache    = require('./SPKCache.js');
var SPKMaker    = require('./SPKObjectMaker.js');
var SPKSync     = require('./SPKSync.js');
var SPKConfig   = require('./SPKConfig.js');

var SPK = function (wrapper) {

  /*************************************************
  /   SPK Global
  *************************************************/
  
  var SPK = this;
  
  /*************************************************
  /   SPK SPK.HMTLs
  *************************************************/

  SPK.HMTL = { 
    wrapper : "" , 
    canvas : "", 
    sidebar : "",
    sliders : "", 
    meta : ""
  };

  /*************************************************
  /   SPK Vars
  *************************************************/

  SPK.GLOBALS = {
    metadata : "",
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
    raycaster : null
  }
  

  /*************************************************
  /   SPK Methods
  *************************************************/
  
  /**
   * Main Init Function
   */
  
  SPK.init = function(wrapper) {

    if( wrapper === null ) {

      console.error("No parent element found");

      return;
    }

    // get those elements in place, you cunt
    SPK.HMTL.wrapper = $(wrapper);
    SPK.HMTL.canvas  = $(wrapper).find("#spk-canvas");
    SPK.HMTL.sidebar = $(wrapper).find("#spk-sidebar");
    SPK.HMTL.sliders = $(SPK.HMTL.sidebar).find("#spk-sliders");
    SPK.HMTL.meta    = $(SPK.HMTL.sidebar).find("#spk-metadata");

    // get the model url
    var href = window.location.pathname;

    SPK.GLOBALS.model = href.substr(href.lastIndexOf('/') + 1);

    // need to init scene before: 
    // make scene > load static  & first instance (into scene) > 
    // > compute bounding box > setup environment > renderloop
    
    SPK.VIEWER.scene = new THREE.Scene();
    
    // load parameters && go!
    
    SPK.getModelMeta(function () {

      SPK.loadParameters(function () {

        SPK.loadInstance(-1, function () {
          
          SPK.alignSliders();

          SPK.addNewInstance();

          SPK.loadStaticInstance();
          
          SPK.setupEnvironment();
        
          SPK.render(); 

          SPKSync.addInstance(SPK);

        });      

      });

    });

   

  }

  SPK.getModelMeta = function(callback) {

    $.getJSON(SPKConfig.GEOMAPI + SPK.GLOBALS.model, function (data) {
      
      SPK.GLOBALS.metadata = data;

      callback();

    })

  }

  SPK.loadParameters = function(callback) {

    $.getJSON(SPK.GLOBALS.metadata.paramsFile, function(data) {
      
      var params = data.parameters;
      
      for( var i = 0; i < params.length; i++ ) {
        
        var paramId = $(SPK.HMTL.wrapper).attr("id") + "_parameter_" + i;

        $(SPK.HMTL.sliders).append( $( "<div>", { id: paramId, class: "parameter" } ) );
        
        $( "#" + paramId ).append( "<p class='parameter_name'>" + params[i].name + "</p>" );
        
        var sliderId = paramId + "_slider_" + i;

        $( "#" + paramId ).append( $("<div>", { id: sliderId, class: "basic-slider" } ) );

        var myRange = {}, norm = 100 / (params[i].values.length-1);

        for( var j = 0; j < params[i].values.length; j++ ) {

          myRange[ norm * j + "%" ] = params[i].values[j];

        }
        
        myRange["min"] = myRange["0%"]; delete myRange["0%"];
      
        myRange["max"] = myRange["100%"]; delete  myRange["100%"];

        var sliderElem = $( "#" + sliderId )[0];
        
        var slider = noUISlider.create( sliderElem, {
          start : [0],
          conect : false,
          tooltips : false,
          snap : true,
          range : myRange,
          pips : {
            mode : "values",
            values : params[i].values,
            density : 3
          }
        });

        // set the callbacks

        slider.on("slide", SPK.removeCurrentInstance);

        slider.on("change", SPK.addNewInstance);

        // add to master

        SPK.GLOBALS.sliders.push(slider);
      }

      callback();

    });

  }

  SPK.getCurrentKey = function () {
    
    var key = "";

    for( var i = 0; i < SPK.GLOBALS.sliders.length; i++ ) {

      key += Number( SPK.GLOBALS.sliders[i].get() ).toString() + ","; 

    }

    return key;

  }

  SPK.removeCurrentInstance = function () {

    var opacity = 1;
    var duration = 1000;
    var out = [];
    
    for(var i = 0; i < SPK.VIEWER.scene.children.length; i++ ) {

      var myObj = SPK.VIEWER.scene.children[i];
      
      if( myObj.removable ) {

          out.push(myObj);

      }
    }

    var tweenOut = new TWEEN.Tween( { x: opacity } )
    .to( {x: 0}, duration )
    .onUpdate( function() {

      for( var i = 0; i < out.length; i++ ) {

        out[i].material.opacity = this.x;

      }

      if( this.x == opacity * 0.5 ) console.log("Wow");

    })
    .onComplete( function() {

      for( var i = 0; i < out.length; i++ ) {

        SPK.VIEWER.scene.remove(out[i]);
        out[i].geometry.dispose();
        out[i].material.dispose();

      }

      SPK.addNewInstance();

    })  ;

    tweenOut.start();

  }

  SPK.addNewInstance = function() {

    var key = SPK.getCurrentKey();

    if(SPK.GLOBALS.currentKey === key) {
    
      console.warn("No key change needed");
    
      return;
    }

    SPK.GLOBALS.currentKey = key;
    SPK.loadInstance( key, function() {

      var iin = [];

      for(var i = 0; i < SPK.VIEWER.scene.children.length; i++ ) {

        var myObj = SPK.VIEWER.scene.children[i];
        
        if( myObj.removable ) {
          
          if( myObj.instance === SPK.GLOBALS.currentKey ) {

            iin.push(myObj);

          } 
        }
      }

      var duration = 600, opacity = 1;
      var tweenIn = new TWEEN.Tween( { x : 0 } )
      .to( { x: opacity }, duration )
      .onUpdate( function() {
        for( var i = 0; i < iin.length; i++ ) {

          iin[i].material.opacity = this.x;

        }
      })

      tweenIn.start();

    });

  }

  SPK.computeBoundingSphere = function() {

    var geometry = new THREE.Geometry();

    for(var i = 0; i < SPK.VIEWER.scene.children.length; i++) {

      if(SPK.VIEWER.scene.children[i].selectable) {
        
        geometry.merge(SPK.VIEWER.scene.children[i].geometry);
      
      }
    }

    geometry.computeBoundingSphere();

    SPK.GLOBALS.boundingSphere = geometry.boundingSphere;
    
    geometry.dispose();

  }

  SPK.setupEnvironment = function () {
    // TODO: Grids, etc.
    // 
    // make the scene + renderer

    SPK.VIEWER.renderer = new THREE.WebGLRenderer( { antialias : false, alpha: true} );

    SPK.VIEWER.renderer.setClearColor( 0xF2F2F2 ); 

    SPK.VIEWER.renderer.setPixelRatio( window.devicePixelRatio );
    
    SPK.VIEWER.renderer.setSize( $(SPK.HMTL.canvas).innerWidth(), $(SPK.HMTL.canvas).innerHeight() ); 

    SPK.VIEWER.renderer.shadowMap.enabled = true;
    
    $(SPK.HMTL.canvas).append( SPK.VIEWER.renderer.domElement );

    SPK.VIEWER.renderer.setSize( $(SPK.HMTL.canvas).innerWidth(), $(SPK.HMTL.canvas).innerHeight() ); 

    SPK.VIEWER.camera = new THREE.PerspectiveCamera( 40, $(SPK.HMTL.canvas).innerWidth() * 1 / $(SPK.HMTL.canvas).innerHeight(), 1, SPK.GLOBALS.boundingSphere.radius * 100 );

    SPK.VIEWER.camera.position.z = -SPK.GLOBALS.boundingSphere.radius*1.8; 

    SPK.VIEWER.camera.position.y = SPK.GLOBALS.boundingSphere.radius*1.8;
    
    SPK.VIEWER.controls = new OrbitCtrls( SPK.VIEWER.camera, SPK.VIEWER.renderer.domElement );

    SPK.VIEWER.controls.addEventListener( 'change', function () {

      SPKSync.syncCamera(SPK.VIEWER.camera) ;

    });


    // lights
    
    SPK.VIEWER.scene.add( new THREE.AmbientLight( 0xD8D8D8 ) );
   
    var flashlight = new THREE.PointLight( 0xffffff, 1, SPK.GLOBALS.boundingSphere.radius * 12, 1);
    
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

  }

  SPK.loadInstance = function(key, callback) {
    
    key = key != -1 ? key : SPK.getCurrentKey();

    SPKLoader.load( "./testmodel/" + key + ".json", function (obj) {

      for( var i = 0; i < obj.geometries.length; i++ ) {

        SPKMaker.make( obj.geometries[i], key, function( obj ) { 
          
          SPK.VIEWER.scene.add(obj);

          // TODO : Add to cache
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

  SPK.makeContext = function() {

    var multiplier = 10;

    var planeGeometry = new THREE.PlaneGeometry( SPK.GLOBALS.boundingSphere.radius * multiplier, SPK.GLOBALS.boundingSphere.radius * multiplier, 2, 2 ); //three.THREE.PlaneGeometry( width, depth, segmentsWidth, segmentsDepth );
    planeGeometry.rotateX( - Math.PI / 2 );
    var planeMaterial = new THREE.MeshBasicMaterial( { color: 0xEEEEEE } ); //0xEEEEEE #D7D7D7
    plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.position.set(SPK.GLOBALS.boundingSphere.center.x, 0,SPK.GLOBALS.boundingSphere.center.z );
    plane.doNotRemove = true;

    grid = new THREE.GridHelper( SPK.GLOBALS.boundingSphere.radius * multiplier, SPK.GLOBALS.boundingSphere.radius*multiplier/30);
    grid.material.opacity = 0.15;
    grid.material.transparent = true;
    grid.position.set(SPK.GLOBALS.boundingSphere.center.x, 0, SPK.GLOBALS.boundingSphere.center.z );
    grid.doNotRemove = true;
    grid.setColors( 0x0000ff, 0x808080 ); 

    //SPK.VIEWER.scene.add( plane );
    SPK.VIEWER.scene.add( grid );

  }

  /*************************************************
  /   SPK Random functions that should probs go somewehere else
  *************************************************/

  SPK.alignSliders = function () {
    var containerHeight = $(SPK.HMTL.sidebar).innerHeight(); 
    console.log(containerHeight + " <-th");
    
    var wrapperHeight = $(SPK.HMTL.sidebar).find("#wrapper-params").height(); 
    console.log(wrapperHeight + " <-th");

    var diff = containerHeight - wrapperHeight;
    console.log(diff)
    if( diff > 0 ) {
      $(SPK.HMTL.sidebar).find("#wrapper-params").css("top", diff/2 + "px");
    }
  }

  SPK.beep = function () {

    return "boop";

  }


  /*************************************************
  /   SPK INIT
  *************************************************/
    
  SPK.init(wrapper);

}

module.exports = SPK;

