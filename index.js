
var smoothie = require('smoothie')
var through = require('through')
var mrcolor = require('mrcolor')()

module.exports = function (opts) {

  var series = {}
  var chart = new smoothie.SmoothieChart(opts)

  var t =  through(function (data) {
    var timestamp = data._timestamp || data.timestamp || data.time || data.date || Date.now()

    var snap = {timestamp: timestamp}

    function add(key, value) {
      var d = 'rgb(' + mrcolor().rgb() + ')'
      if(!series[key]) {
        series[key] = new smoothie.TimeSeries()
        chart.addTimeSeries(series[key], {
          strokeStyle: d, lineWidth: 2
        })
      }
      snap[key] = value
      series[key].append(timestamp, value)
    }

    function firstNumber (o, names) {
      for(var i in names)
        if('number' === typeof o[names[i]])
           return add(key, o[names[i]])
    }

    for(var key in data) {
      var value = data[key]
      if(key === 'timestamp' || key == '_timestamp')
        ; //do nothing
      else if('number' === typeof value)
        add(key, value, timestamp)
      else if('object' === typeof value) {
        firstNumber(value, ['mean', 'rate', 'value'])
      }
    }
    this.emit('data', snap)
  })

  t.chart = chart
  t.series = series

  t.streamTo = function (canvas, delay) {
    t.chart.streamTo(canvas, delay)
  }
  if(opts.canvas)
    t.streamTo(opts.canvas, opts.delay || 1e3)

  return t
}
