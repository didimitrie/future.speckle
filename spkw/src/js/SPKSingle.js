/**
 * 
 *
 *  Welcome. This here is maybe a messy code, but hopefully it will work. 
 *  (c) 2016 Dimitrie A. Stefanescu
 *
 *
 */

var $   = require('jquery'); 
var SPK = require('./SPK.js');
//var SPKUiManager = require('./SPKUiManager.js');

$( function() {

  var mySPK  = new SPK( $( '#spk-viewer' ), {
    saver : true,
    settings : true,
    logger : false
  });

});

