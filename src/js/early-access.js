function zeroPad (num, size) {
  var str = num.toString()
  return repeatString('0', size).substr(0,size - str.length)+str
}

function repeatString(str, times) {
  if (typeof str.repeat == 'function') {
    return str.repeat(times)
  }
  return Array.apply(null, Array(times)).reduce(function (s) {
    return s + str
  }, "")
}

function dateToCountdownString (date, opts) {
  opts = opts || {};
  var end = new Date(date)
  var diff = dateToRemainingTime(date)
  var cd = new Date(diff)
  var parts = []
  var days = cd.getUTCDate() - 1
  var hours = cd.getUTCHours()
  var minutes = cd.getUTCMinutes()
  var seconds = cd.getUTCSeconds()
  if(days > 0) {
    if(opts.showDays) {
      var label = opts.dayLabel;

      if(label.indexOf('/') > 0) {
        var pluralize = label.split('/');
        label = pluralize[days == 1 ? 0 : 1];
      }

      parts.push(zeroPad(days) + label);
    }
    else {
      hours += days * 24
    }
  }
  if(hours > 0 || (days > 0 && opts.showDays)) {
    if(opts.showHours) {
      if(days > 0 && opts.showDays) {
        parts.push(zeroPad(hours, 2) + 'h')
      }
      else {
        parts.push(hours + 'h')
      }
    }
  }
  if(opts.showMinutes) {
    parts.push(zeroPad(minutes, 2) + 'm')
  }
  if(opts.showSeconds) {
    parts.push(zeroPad(seconds, 2) + 's')
  }
  parts=parts.map(function (p) {
    return '<span class="unit ' + p.substr(-1,1) + '">' + p + '</span>'
  })
  if(parts.length > 0) {
    return parts.join(" ")
  }
  return "0s"
}

function startCountdownTicks () {
  clearTimeout(startCountdownTicks.timeout)
  function tick () {
    updateCountdownEls()
    startCountdownTicks.timeout = setTimeout(tick, 250)
  }
  tick()
}
startCountdownTicks.timeout = null

function stopCountdownTicks () {
  clearTimeout(startCountdownTicks.timeout)
}

function dateToRemainingTime (date) {
  var now = new Date()
  var diff = date.getTime() - now.getTime()
  if(diff < 0) {
    diff = 0
  }
  return diff
}

function updateCountdownEls () {
  var els = document.querySelectorAll('[role=countdown]')
  for(var i = 0; i < els.length; i++) {
    var el = els[i]
    var date = new Date(el.getAttribute('to'))
    var time = dateToRemainingTime(date)
    if(time <= 0 && el.getAttribute('completed-called') != 'true') {
      if (el.hasAttribute('completed')) {
        var fn = getMethod(el, 'completed')
        if(fn) {
          fn.apply(fn, [el, date, time])
          el.setAttribute('completed-called', 'true')
        }
      }
    }
    var opts = {};
    opts.showDays = parseInt(el.getAttribute('show-days')) == 1;
    opts.showHours = parseInt(el.getAttribute('show-hours')) != 0;
    opts.showMinutes = parseInt(el.getAttribute('show-minutes')) != 0;
    opts.showSeconds = parseInt(el.getAttribute('show-seconds')) != 0;
    opts.dayLabel = el.hasAttribute('day-label') ? el.getAttribute('day-label') : 'd';
    el.innerHTML = dateToCountdownString(date, opts)
  }
}
