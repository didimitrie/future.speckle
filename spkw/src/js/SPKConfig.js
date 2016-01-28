
var SPKConfig = function () {

  var SPKConfig = this;

  SPKConfig.GEOMAPI    = "http://localhost:8000/api/model/";
  SPKConfig.METAAPI    = "http://localhost:8000/api/model/metadata/";
  SPKConfig.INSTAPI    = "http://localhost:8000/api/model/instances/";
  SPKConfig.APPID      = "SPKWOfficial";

}

module.exports = new SPKConfig();