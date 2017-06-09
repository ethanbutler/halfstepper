import React, { Component, PropTypes } from 'react';
import { ipcRenderer }   from 'electron'
import styles from './Box.css';
import { ipcMidiClient } from '../lib/ipc-client'
import colors from '../lib/colorUtilities';

const colorBase      = colors.lighten(colors.random(), 65)
const colorDeviation = 40
const randomColorFromBase = () => {
  return colors.random(colorBase, colorDeviation)
}

const gradient = { backgroundImage: `linear-gradient(to right, #${colorBase}, #${randomColorFromBase()}, #${randomColorFromBase()}, #${randomColorFromBase()}, #${randomColorFromBase()}, #${colorBase})` }

console.log(gradient)

const makeEmptyArrangement = beats => {
  const arrangement = []
  for(let id = 1; id < beats; id++){
    arrangement.push({
      id,
      notes: []
    })
  }
  return arrangement
}

export default class Box extends Component {
  constructor(props){
    super(props)
    this.state = {
      arrangement: [{ id: 0, notes: [60] }, ...makeEmptyArrangement(this.props.beats, 7)],
      beats: {
        perMinute: 108,
        perCycle: this.props.beats
      },
      channels: [
        {
          id: 1,
          alias: 'Kick',
          color: randomColorFromBase(),
          note: 60
        },
        {
          id: 2,
          alias: 'Snare',
          color: randomColorFromBase(),
          note: 62
        },
        {
          id: 3,
          alias: 'Hat (Open)',
          color: randomColorFromBase(),
          note: 64
        },
        {
          id: 4,
          alias: 'Hat (Closed)',
          color: randomColorFromBase(),
          note: 65
        },
        {
          id: 5,
          alias: 'Clap',
          color: randomColorFromBase(),
          note: 67
        },
        {
          id: 6,
          alias: 'Conga',
          color: randomColorFromBase(),
          note: 69
        },
        {
          id: 7,
          alias: 'Cymbal',
          color: randomColorFromBase(),
          note: 71
        },
        {
          id: 8,
          alias: 'Rim',
          color: randomColorFromBase(),
          note: 72
        }
      ],
      currentBeat: 0,
      isPlaying: false
    }
  }

  componentDidMount(){
    ipcRenderer.on('beatChange', (event, currentBeat) => {
      console.log(currentBeat)
      this.setState({ currentBeat })
    })
  }

  handleNoteChange(e){
    // TODO: write this in redux
    let { beat, note } = e.target.dataset
    const arrangement  = this.state.arrangement.slice()
    const { notes }    = arrangement[beat]
    beat = parseInt(beat)
    note = parseInt(note)
    if(notes.includes(note)){
      notes.splice(notes.indexOf(note), 1)
    } else {
      notes.push(note)
    }
    Object.assign(arrangement[beat], { notes })
    ipcMidiClient.update(arrangement).then(() => {
      return this.setState({ arrangement })
    }).catch(err => console.log(err))
  }

  handlePlay(){
    this.setState({ isPlaying: true })
    ipcMidiClient.play().then(event => {
      return console.log(event)
    }).catch(err => console.log(err))
  }

  handlePause(){
    this.setState({ isPlaying: false })
    ipcMidiClient.pause().then(event => {
      return console.log(event)
    }).catch(err => console.log(err))
  }


  renderChannel(channel){
    const labelBg = { backgroundColor: `#${colors.darken(channel.color, 60)}` }
    return (
      <div className={styles.channel} key={channel.id}>
        <div className={styles.channel_name} style={labelBg}>{channel.alias}</div>
        <div className={styles.channel_notes}>
          {this.state.arrangement.map(beat => {
            let inner
            const isOdd = beat.id % 2 === 0
            const noteBg = { backgroundColor: `#${colors.darken(channel.color, isOdd ? 50 : 55)}` }
            if(beat.notes.includes(channel.note)){
              const innerStyle = { opacity: 0.8 } // TODO: replace this with velocity
              if(beat.id === this.state.currentBeat){
                Object.assign(innerStyle, {
                  width: '80%',
                  paddingBottom: '80%'
                })
              }
              inner = <div className={styles.note_inner} style={innerStyle}>&nbsp;</div>
            }
            return (
              <button
                key={`${channel.note}_${beat.id}`}
                data-note={channel.note}
                data-beat={beat.id}
                onClick={this.handleNoteChange.bind(this)}
                className={styles.note}
                style={noteBg}
              >
                {inner}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  render() {
    const { channels, isPlaying } = this.state
    const controlsBg = { background: `linear-gradient(to right, #${colors.darken(colorBase, 65)}, #${colors.darken(colorBase, 75)})` }
    const faded = { opacity: 0.5 } // for disabled buttons
    const pausedBg = Object.assign({}, gradient, { animation: 'none' }) // disable animations
    console.log(gradient)
    return (
      <div className={styles.box} data-tid="container">
        <div className={styles.background} style={isPlaying ? gradient : pausedBg}>&nbsp;</div>
        <section className={styles.controls} style={controlsBg}>
          <button
            disabled={isPlaying}
            className={styles.control_button}
            onClick={this.handlePlay.bind(this)}
            style={isPlaying ? faded : null}
          >Play</button>
          <button
            disabled={!isPlaying}
            className={styles.control_button}
            onClick={this.handlePause.bind(this)}
            style={!isPlaying ? faded : null}
          >Pause</button>
        </section>
        <section className={styles.channels}>
          {channels.map(this.renderChannel.bind(this))}
        </section>
      </div>
    )
  }
}

Box.propTypes = {
  beats: PropTypes.number.isRequired
}
