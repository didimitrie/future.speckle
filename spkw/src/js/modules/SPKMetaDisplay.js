/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */

var $               = require('jquery');

var SPKMetaDisplay = function ( options ) { 
  
  var SPKMetaDisplay = this;
  var Data = {};
  var Wrapper = {};
  
  SPKMetaDisplay.init = function ( options ) {
    $( '#' + options.wrapperid ).find( ".name" ).html( options.spk.modelName );
    $( '#' + options.wrapperid ).find( ".author-date" ).html( " by " + options.spk.ownerName + " | " + options.spk.dateAdded);
  }

  SPKMetaDisplay.init( options );
}

module.exports = SPKMetaDisplay;