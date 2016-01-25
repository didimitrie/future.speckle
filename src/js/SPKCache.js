
var SPKCache = function() {
  
  var SPKCache = this;

  SPKCache.instances = [];

  SPKCache.add = function(instance, key) {
    // TODO
  } 

  SPKCache.get = function(key) {
    
    for( var i = 0; i < SPKCache.instances.length; i++ ) {
    
      if( SPKCache.instances[i].key === key ) 
    
        return SPKCache.instances[i];
    
    }
    
    return null;
  }

  SPKCache.clear = function() {
    // TODO 
  }
}

module.exports = new SPKCache();