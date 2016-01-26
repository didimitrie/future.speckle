
var $           = require('jquery');
var SPKConfig   = require('./SPKConfig.js');

var SPKLogger = function () {

  var SPKLogger = this;

  SPKLogger.sessionid = null;


  SPKLogger.mx = 0;
  SPKLogger.my = 0;

  SPKLogger.newSession = function (id) {

    if( SPKLogger.sessionid != null ) return;
    
    var sendData = { 
      type: "newSession",
      modelid: id
    }
    
    $.post(SPKConfig.METAAPI, sendData, function (sessionid) {

      SPKLogger.sessionid = sessionid;

    });
    
  }

  SPKLogger.postUpdate = function(data) {
    
    $.post(SPKConfig.METAAPI, data, function (dataa) {

      if(dataa === "err") 
        console.warn("SPK_ERR: Failed to update metadata");
    
    });

  }

  SPKLogger.updateScreenSize = function() {
    var sendData = {
      sessionid: SPKLogger.sessionid,
      type: "updateViewport",
      viewportsize: window.innerHeight + "x" + window.innerWidth
    }

    SPKLogger.postUpdate(sendData);

  }

  SPKLogger.addUsedInstance = function(key) {
    
    var sendData = {
      sessionid : SPKLogger.sessionid,
      type : "addInstance",
      key : key
    }
    
    SPKLogger.postUpdate(sendData);

  }
  
  SPKLogger.addMouseClick = function(mouseposition) {
    
    var sendData = {
      sessionid : SPKLogger.sessionid,
      type : "addMouseClick",
      mouseloc : {x: SPKLogger.mx, y: SPKLogger.my}
    }

    SPKLogger.postUpdate(sendData);

  }

  SPKLogger.finishSession = function() {

    SPKLogger.postUpdate( {sessionid: SPKLogger.sessionid, type:"sessionend"} );

  }

  /*************************************************
  /   SPKLogger document events
  *************************************************/

  // continously update mouse pos
  window.onmousemove = function(e) { 
    
    SPKLogger.mx = e.pageX; 

    SPKLogger.my = e.pageY; 

  }

  // trigger event
  $(window).click( function() {

    SPKLogger.addMouseClick();

  });

  // update exit time beforeunload
  $(window).bind('beforeunload', SPKLogger.finishSession );

}

module.exports = new SPKLogger();