
var SPKSync = function (spkInstances) {

  var SPKSync = this;

  SPKSync.instances = [];

  SPKSync.addInstance = function (instance) {

    SPKSync.instances.push(instance);

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

}

module.exports = new SPKSync();