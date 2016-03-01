
var $               = require('jquery');
var shortid         = require('shortid');

var SPKHelpControl = function ( options ) {

  var SPKHelpControl = this
  
  SPKHelpControl.id = shortid.generate()
  SPKHelpControl.Wrapper = {}

  SPKHelpControl.init = function ( options ) {

    SPKHelpControl.Wrapper = $( "#" + options.wrapperid );
    $( SPKHelpControl.Wrapper ).attr( "spktabid", SPKHelpControl.id );

    var uitabs = $( "#" + options.uitabid );
    var icon = "<div class='icon' spkuiid='" + SPKHelpControl.id + "'><i class='fa " + options.icon + "'></div>";
    $(uitabs).append(icon);

    $("[spkuiid='"+ SPKHelpControl.id + "']").click( function() {
      $( "#spk-ui-tabs").find(".icon").removeClass( "icon-active" );
      $( this ).addClass( "icon-active" );
      $( ".sidebar" ).addClass( "sidebar-hidden" );
      $( "[spktabid='"+ SPKHelpControl.id + "']").removeClass( "sidebar-hidden" );
    } )

  }

  SPKHelpControl.init( options );
}

module.exports = SPKHelpControl;