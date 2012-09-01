
var smoothie = require('smoothie')
var through = require('through')

module.exports = function (opts) {

  var series = {}
  var chart = new smoothie.SmoothieChart(opts.chart)

  function add(key, value, ts) {
    if(!series[key]) {
      series[key] = new smoothie.TimeSeries()
      chart.addTimeSeries(series[key])
    }
    series[key].append(ts, value)
  }

  var t =  through(function (data) {
    var timestamp = data._timestamp || data.timestamp || Date.now()

    function firstNumber (o, names) {
      for(var i in names)
        if('number' === typeof o[names[i]])
           return add(key, o[names[i]], timestamp)
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
