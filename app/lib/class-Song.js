import { output } from './midi-connector'

class Song {

  constructor(){
    this.cycle          = null
    this.beat           = -1
    this._arrangement   = []
    this._bpm           = 128
    this._bpc           = 16
    this._log           = false
    this._onBeatChange  = null
  }

  play(){
    let beat       = this.beat
    const log      = this._log
    this.cycle = setInterval(() => {
      if(log) console.log('tick')

      beat = (beat + 1 < this._arrangement.length) ? beat + 1 : 0
      const notes = this._arrangement[beat]

      if(!notes) return

      notes.map(note => {
        if(log) console.log(note)
        output.sendMessage([144, note, 100])
        setTimeout(() => {
          output.sendMessage([144, note, 0])
        }, 125)
      })

      if(this._onBeatChange) this._onBeatChange(beat)
      this.beat = beat
    }, ((60 / this._bpm) * 1000) / (this._bpc / 4)) // eslint-disable-line padded-blocks
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

  set onBeatChange(cb){
    this._onBeatChange = cb
  }

}

module.exports = { Song }
