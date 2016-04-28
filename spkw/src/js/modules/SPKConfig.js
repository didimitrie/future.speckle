/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */


var SPKConfig = function () {

  var SPKConfig = this;
  
  if (!location.origin) location.origin = location.protocol + "//" + location.host;
  SPKConfig.ORIGIN = location.origin;

  SPKConfig.APPDIR     = location.origin;
  SPKConfig.UPLOADDIR  = location.origin + "/uploads";
  SPKConfig.GEOMAPI    = location.origin + "/api/model/";
  SPKConfig.METAAPI    = location.origin + "/api/model/metadata/";
  SPKConfig.INSTAPI    = location.origin + "/api/model/instances/"; 
  
}

module.exports = new SPKConfig();