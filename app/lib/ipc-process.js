const { ipcMain } = require('electron')
const { Song }    = require('./class-Song')

class MidiProcess {
  constructor(webContents){
    this.webContents = webContents
  }

  init(){
    const song = new Song()

    song.bpm = 128
    song.arrangement = []
    song.log = true
    song.onBeatChange = beat => {
      this.webContents.send('beatChange', beat)
    }

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
      song.arrangement = arrangement.map(beat => {
        return beat.notes //
      })
      event.sender.send(`update-${token}`, 'arrangement updated')
    })
  }
}

module.exports = { MidiProcess }
