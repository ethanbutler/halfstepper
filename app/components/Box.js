import React, { Component } from 'react';
import styles from './Box.css';
import { play, pause } from '../lib/ipc-client'

export default class Home extends Component {
  constructor(props){
    super(props)
    this.song = null
    this.state = {

    }
  }

  handlePlay(){
    play().then(event => {
      return console.log(event)
    }).catch(err => {
      console.log(err)
    })
  }

  handlePause(){
    pause().then(event => {
      return console.log(event)
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div>
        <div className={styles.box} data-tid="container">
          <section>
            <h1>Controls</h1>
            <button onClick={this.handlePlay}>Play</button>
            <button onClick={this.handlePause}>Pause</button>
          </section>
          <section>Channels</section>
        </div>
      </div>
    );
  }
}
