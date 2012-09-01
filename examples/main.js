var SmoothieStream = require('../')
var from = require('from')

//generate a stream with random data

var names = 'EFHIJKLMNOPQRSTUVWXYZ'.split('')
var d = {A: 0.5, B: 0.5, C: 0.5}
from(function (i, next) {
  var a, b, c
  for(var k in d) {
    d[k] = d[k] + (Math.random() - 0.5)
  }

  if(Math.random() < 0.02 && names.length)
    d[names.shift()] = Math.random()

  d.timestamp = Date.now()
  this.emit('data', d)
  setTimeout(next, 500)
}).pipe(SmoothieStream({
  canvas: document.getElementById('canvas'),
  chart: {millisPerPixel: 200}
}))

