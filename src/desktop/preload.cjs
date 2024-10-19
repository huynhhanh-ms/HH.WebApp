// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   for (const versionType of['chrome', 'electron', 'node']) {
//       document.getElementById(`${versionType}-version`).innerText = process.versions[versionType]
//   }

//   document.getElementById('serialport-version').innerText = require('serialport/package').version

// })

const { contextBridge, ipcRenderer } = require('electron')


const handleApi = {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  getData: () => ipcRenderer.invoke('get-data')
}

contextBridge.exposeInMainWorld('electronApi', handleApi);
