var EventEmitter = require('events').EventEmitter;
var now = require('microtime').now;

module.exports =
function FrequencyMeter(targetInterval) {
  if (! targetInterval) targetInterval = 1000;

  var events = [];
  var frequency = 0;
  var timeout;

  var ee = new EventEmitter();

  // happened
  ee.happened =
  ee.activity =
  function happened() {
    var t = now();
    events.push(t);
    // filter out old events
    events = events.filter( function(x) {
      return (x > t - targetInterval);
    });
  };

  /// end
  ee.end =
  function end() {
    unschedule();
    
    ee.happened = 
    ee.activity =
    function() {
      throw new Error('ended');
    };
  };

  schedule();

  return ee;

  //// ------
  
  function schedule() {
    timeout = setTimeout(function() {
      ee.emit('frequency', 1000 * (events.length / targetInterval));
    }, targetInterval);
  }

  function unschedule() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  }

};
