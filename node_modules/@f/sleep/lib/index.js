/**
 * Expose sleep
 */

module.exports = sleep

/**
 * sleep
 */

function sleep (ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}
