# smoothie-stream

Stream time-series to a chart and watch it in your browser.

Stream interface to [smoothie](https://github.com/joewalnes/smoothie)

compatible with [probe-stream](https://github.com/dominictarr/probe-stream)

``` js
var SmoothieStream = require('smoothie-stream')
var from = require('from')

//generate a stream with random data
from(function (i, next) {

  this.emit('data', {
    A: Math.random(),
    B: Math.random(),
    C: Math.random(),
    timestamp: Date.now()
  })
  setTimeout(next, 500)
}).pipe(
  //and just pipe it to smoothie-stream!
  SmoothieStream({
    canvas: document.getElementById('canvas'),
    chart: {millisPerPixel: 20}
  })

)

```

## License

MIT
