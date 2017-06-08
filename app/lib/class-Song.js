import { output } from './midi-connector'

class Song {

  constructor(){
    this.cycle          = null
    this._arrangement   = []
    this._bpm           = 128
    this._log           = false

    this.instruments = [60, 62, 64, 65]
  }

  play(){
    let beat       = this._arrangement.length // set to last beat so it starts on 0
    const interval = 60 / this._bpm
    const log      = this._log
    this.cycle = setInterval(() => {
      if(log) console.log('tick')

      beat = (beat + 1 < this._arrangement.length) ? beat + 1 : 0
      const notes = this._arrangement[beat]

      notes.map(note => {
        if(log) console.log(note)
        output.sendMessage([144, this.instruments[note], 100])
      })

    }, interval * 500) // eslint-disable-line padded-blocks
  }

  pause(){
    clearInterval(this.cycle)
  }

  set arrangement(value){
    this._arrangement = value
  }

  set bpm(value){
    this._bpm = value
  }

  set log(value){
    this._log = value
  }

}

module.exports = { Song }
