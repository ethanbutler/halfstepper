const { ipcRenderer } = require('electron')
const Promise = require('bluebird')

const play = () => {
  console.log('play')
  return new Promise(resolve => {
    const token = 'hello' // TODO: replace with something dynamic
    ipcRenderer.send('play', token)
    ipcRenderer.on(`play-${token}`, event => {
      resolve(event)
    })
  })
}

const pause = () => {
  console.log('pause')
  return new Promise(resolve => {
    const token = 'hello' // TODO: replace with something dynamic
    ipcRenderer.send('pause', token)
    ipcRenderer.on(`pause-${token}`, (event) => {
      resolve(event)
    })
  })
}

const updateArrangement = arrangement => {
  const token = 'hello' // TODO: replace with something dynamic
  return new Promise(resolve => {
    ipcRenderer.send('update', { token, arrangement })
    ipcRenderer.on(`update-${token}`, (event) => {
      resolve(event)
    })
  })
}

module.exports = {
  play,
  pause,
  updateArrangement
}
