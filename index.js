var EventEmitter = require('events').EventEmitter;
var now = require('microtime').now;
// console.log("ekarak/frequency-meter2");
module.exports =
function FrequencyMeter(targetInterval) {
  if (! targetInterval) targetInterval = 1000;

  var events = [];
  var timeout;
  var t = now();
  var ee = new EventEmitter();

  // happened
  ee.happened =
  ee.activity =
  function happened() {
    events.push(now());
    // console.log("happened, events.length=="+events.length);
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
		// console.log("fire in the hole!");
      ee.emit('frequency', 1000 * (events.length / targetInterval));
      clearOldEvents();
      t = now();
      schedule();
    }, targetInterval);
  }

  function unschedule() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  }

  // filter out old events
  function clearOldEvents() { 
    events = events.filter( function(x) {
      return (x > t - targetInterval*1000);
    });
  }
};
