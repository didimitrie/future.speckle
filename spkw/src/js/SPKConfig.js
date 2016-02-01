
var SPKConfig = function () {

  var SPKConfig = this;

  // deployment
  /* 
  SPKConfig.GEOMAPI    = "http://beta.speckle.xyz/api/model/";
  SPKConfig.METAAPI    = "http://beta.speckle.xyz/api/model/metadata/";
  SPKConfig.INSTAPI    = "http://beta.speckle.xyz/api/model/instances/";
  SPKConfig.APPID      = "SPKWOfficial";
   */
  
  // testing
 
  SPKConfig.APPDIR     = "http://localhost:9009";
  SPKConfig.UPLOADDIR  = "http://localhost:9009/uploads";
  SPKConfig.GEOMAPI    = "http://localhost:9009/api/model/";
  SPKConfig.METAAPI    = "http://localhost:9009/api/model/metadata/";
  SPKConfig.INSTAPI    = "http://localhost:9009/api/model/instances/";
  SPKConfig.APPID      = "SPKWOfficial";

}

module.exports = new SPKConfig();