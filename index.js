var EventEmitter = require('events').EventEmitter;

module.exports =
function FrequencyMeter(samplingWindow, ntfyInterval) {
  if (! samplingWindow) samplingWindow = 1000;
  if (! ntfyInterval) ntfyInterval = samplingWindow;
  
  var events = [];
  var timeout;
  var ee = new EventEmitter();

  // happened
  ee.happened =
  ee.activity =
  function happened() {
    events.push(Date.now());
    //console.log("happened, events.length=="+events.length);
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
        return (x > Date.now() - 1000 * samplingWindow);
      });

      var frequency = (1000 * events.length / samplingWindow);
	// console.log("fire in the hole! freq="+frequency);
      ee.emit('frequency', frequency);
    }, ntfyInterval);
  }

  function unschedule() {
    if (timeout) {
      clearInterval(timeout);
      timeout = undefined;
    }
  }
};
