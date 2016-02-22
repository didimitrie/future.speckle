
// Really basic handler

var $               = require('jquery');

var SPKMetaDisplay = function ( options ) { 
  
  var SPKMetaDisplay = this;
  var Data = {};
  var Wrapper = {};
  
  SPKMetaDisplay.init = function ( options ) {
    console.log(options);
    $( '#' + options.wrapperid ).find( ".name" ).html( options.spk.modelName );
    $( '#' + options.wrapperid ).find( ".author-date" ).html( " by " + options.spk.ownerName + " | " + options.spk.dateAdded);
  }

  SPKMetaDisplay.init( options );
}

module.exports = SPKMetaDisplay;