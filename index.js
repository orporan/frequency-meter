var EventEmitter = require('events').EventEmitter;
var now = require('microtime').now;

module.exports =
function FrequencyMeter(samplingWindow, notificationMultiplier) {
  if (! samplingWindow) samplingWindow = 1000;
  if (! notificationMultiplier) notificationMultiplier = 5;
  
  var events = [];
  var timeout;
  var ee = new EventEmitter();

  // happened
  ee.happened =
  ee.activity =
  function happened() {
    events.push(now());
    console.log("happened, events.length=="+events.length);
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
    timeout = setInterval(function() {
      // filter out old events
      events = events.filter( function(x) {
        return (x > now() - 1000 * samplingWindow);
      });

      var frequency = (events.length / samplingWindow);
	//console.log("fire in the hole! freq="+frequency);
      ee.emit('frequency', frequency);
    }, samplingWindow/notificationMultiplier);
  }

  function unschedule() {
    if (timeout) {
      clearInterval(timeout);
      timeout = undefined;
    }
  }
};
