const { ipcRenderer } = require('electron')

const submitListener = document
  .querySelector('form')
  .addEventListener('submit', (event) => {
    event.preventDefault()

    const files = [...document.getElementById('filePicker').files]

    const filesFormatted = files.map(({ name, path: pathName }) => ({
      name,
      pathName
    }))

    ipcRenderer.send('files', filesFormatted)
  })

ipcRenderer.on('metadata', (event, metadata) => {
  const pre = document.getElementById('data')

  pre.innerText = JSON.stringify(metadata, null, 2)
})

ipcRenderer.on('metadata:error', (event, error) => {
  console.error(error)
})
