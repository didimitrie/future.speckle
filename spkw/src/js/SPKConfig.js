/*
 * Beta.Speckle Parametric Model Viewer
 * Copyright (C) 2016 Dimitrie A. Stefanescu (@idid) / The Bartlett School of Architecture, UCL
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of  MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var SPKConfig = function () {

  var SPKConfig = this;

  // deployment
  SPKConfig.APPDIR     = "http://beta.speckle.xyz";
  SPKConfig.UPLOADDIR  = "http://beta.speckle.xyz/uploads";
  SPKConfig.GEOMAPI    = "http://beta.speckle.xyz/api/model/";
  SPKConfig.METAAPI    = "http://beta.speckle.xyz/api/model/metadata/";
  SPKConfig.INSTAPI    = "http://beta.speckle.xyz/api/model/instances/";
   
  
  // testing
  SPKConfig.APPDIR     = "http://localhost:9009";
  SPKConfig.UPLOADDIR  = "http://localhost:9009/uploads";
  SPKConfig.GEOMAPI    = "http://localhost:9009/api/model/";
  SPKConfig.METAAPI    = "http://localhost:9009/api/model/metadata/";
  SPKConfig.INSTAPI    = "http://localhost:9009/api/model/instances/";
 
}

module.exports = new SPKConfig();