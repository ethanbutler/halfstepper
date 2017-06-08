const { ipcMain } = require('electron')
const { Song }    = require('./class-Song')

class MidiProcess {
  constructor(){}

  init(){
    const song = new Song()

    song.bpm = 128
    song.arrangement = [
      [0],
      [2],
      [1],
      [3]
    ]

    ipcMain.on('play', (event, arg) => {
      song.play()
      event.sender.send(`play-${arg}`, 'song played')
    })
    .on('pause', (event, arg) => {
      song.pause()
      event.sender.send(`paused-${arg}`, 'song pauseded')
    })
    .on('update', (event, arg) => {
      const { token, arrangement } = arg
      song.arrangement(arrangement)
      event.sender.send(`update-${token}`, 'arrangement updated')
    })
  }
}

module.exports = { MidiProcess }
