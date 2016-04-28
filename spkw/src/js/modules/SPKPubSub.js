
var events = function () {
  var topics = {}
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function ( topic, listener ) {
      // create the topic if it's not yet created
      if( !hOP.call( topics, topic ) ) topics[ topic ] = [];

      // add the listener to the queue
      var index = topics[ topic ].push( listener ) - 1;
      return {
        remove: function() {
          delete topics[topic][index];
        }
      }
    },
    publish: function ( topic, info ) {
      if( !hOP.call( topics, topic) ) return;
      topics[topic].forEach(function(item) {
          item(info != undefined ? info : {});
      });
    }
  }
}

module.exports = new events();