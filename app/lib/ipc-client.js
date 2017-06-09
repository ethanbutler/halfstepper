const { ipcRenderer } = require('electron')
const Promise = require('bluebird')

const generateToken = () => Date.now()

const play = () => {
  console.log('play')
  return new Promise(resolve => {
    const token = generateToken()
    ipcRenderer.send('play', token)
    console.log(`play-${token}`)
    ipcRenderer.on(`play-${token}`, event => {
      resolve(event)
    })
  })
}

const pause = () => {
  console.log('pause')
  return new Promise(resolve => {
    const token = generateToken()
    ipcRenderer.send('pause', token)
    ipcRenderer.on(`pause-${token}`, (event) => {
      resolve(event)
    })
  })
}

const update = arrangement => {
  return new Promise(resolve => {
    const token = generateToken()
    ipcRenderer.send('update', { token, arrangement })
    ipcRenderer.on(`update-${token}`, (event) => {
      resolve(event)
    })
  })
}

const ipcMidiClient = {
  play,
  pause,
  update
}

module.exports = {
  ipcMidiClient
}
