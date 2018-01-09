/**
 * Imports
 */

var sleep = require('..')
var test = require('tape')
var elapsed = require('@f/elapsed-time')

/**
 * Tests
 */

test('should work', function (t) {
  var time = elapsed()
  sleep(100).then(function () {
    t.ok(Math.abs(time() - 100) < 20)
    t.end()
  })
})
