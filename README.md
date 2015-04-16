# Frequency Meter [![Build Status](https://secure.travis-ci.org/ekarak/frequency-meter.png)](http://travis-ci.org/ekarak/frequency-meter)

Measures the frequency of events. This is a slightly modified version off pgte's initial code. My version has a more deterministic output, as the original version used dynamic rescheduling of count periods which produced significant skew after the first few minutes of operation.


## Install

```bash
$ npm install https://github.com/ekarak/frequency-meter
```


## Use

Require:

```javascript
var FM = require('frequency-meter');
```

Construct:

```javascript
var fm = FM();
```

or construct with explicit measuring and notifications intervals (both default to 1 second):

```javascript
var fm = FM(60000, 5000); // calculate frequency for events occuring in the previous 1 minute, report frequency every 5 seconds
```

Feed it events:

```javascript
setInterval(function() {
  fm.happened();
}, 100);
```

And listen for frequency updates:

```javascript
fm.on('frequency', function(freq) {
  console.log('frequency is', freq);
});
```

End it:

```javascript
fm.end();
```

## License

MIT
