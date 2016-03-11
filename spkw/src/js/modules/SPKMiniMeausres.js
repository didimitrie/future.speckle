/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Dimitrie Andrei Stefanescu & University College London (UCL)
 */

var $               = require('jquery');

var SPKMiniMeasures = function ( options ) { 
  
  var SPKMiniMeasures = this
  SPKMiniMeasures.Options = {}

  SPKMiniMeasures.init = function( options ) {
    SPKMiniMeasures.Options = options;
  }

  SPKMiniMeasures.init( options );
}

module.exports = SPKMiniMeasures;