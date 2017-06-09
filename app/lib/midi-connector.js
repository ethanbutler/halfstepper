const midi   = require('midi')

const output = new midi.output() // eslint-disable-line new-cap
output.openPort(0)

module.exports = { output }
