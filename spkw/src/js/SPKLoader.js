
/*
  Handles all json loading and parsing
 */

var THREE       = require('three');

var SPKLoader = function () {
  
  var SPKLoader = this;

  /**
   * [load description]
   * @param  {[type]} url          [description]
   * @param  {[type]} onLoadAction [This is where the magic happens. It's passed around! ]
   * @return {[type]}              [description]
   */
  SPKLoader.load = function(url, onLoadAction) {

    var loader = new THREE.XHRLoader();
  
    loader.load(
      url, 
      function ( text ) { 
        SPKLoader.parse( JSON.parse( text ), onLoadAction );
      }, 
      SPKLoader.onProgress, 
      SPKLoader.onError
    );

  } 

  SPKLoader.parse = function(json, onLoadAction) {
    
    var collatedReturn = {};
    
    collatedReturn.geometries = SPKLoader.parseGeometries( json. geometries );
    
    collatedReturn.properties = json.metadata.properties;

    onLoadAction(collatedReturn);

  }

  SPKLoader.parseGeometries = function (json, instanceName) {

    var geometries = [];

    if( json != undefined ) {

      var geometryLoader = new THREE.JSONLoader();

      for( var i = 0; i < json.length; i ++ ) {

        var geometry = {};
        var data = json[ i ];

        switch( data.type ) {

          case 'TextGeometry' : 
            //TODO
            break;

          case  'SPKL_Polyline' : 
            geometry = geometryLoader.parse( data.data ).geometry;
            geometry.isClosed = data.data.isClosed;
            break;

          case 'SPKL_Mesh' : 
            geometry = geometryLoader.parse( data.data ).geometry;
            break;

          case 'SPKL_ColorMesh' :
            geometry = geometryLoader.parse( data.data ).geometry;
            geometry.vertexColors = data.data.vertexColors;
            break;

          case 'SPKL_Point' : 
            geometry = geometryLoader.parse( data.data ).geometry;
            break;

          case 'SPKL_Options' :
            console.warn("Found some SPKL Options. Ignoring.")
            break;
            
          default : 
            // console.warn("Unsuported data type detected!");
            // console.log(data);
            break;

        }//end switch

        geometry.SPKLType = data.type;
        geometry.instanceName = instanceName;

        geometry.uuid = data.uuid;
        
        if( data.name !== undefined ) {
          geometry.name = data.name;
        }

        geometries.push(geometry);

      }//end for
    }//end if

    return geometries;

  }

  SPKLoader.onProgress = function()  {
    // TODO
  }
  SPKLoader.onError = function() {
    // TODO
  }

}

module.exports = new SPKLoader();