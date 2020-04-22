const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const util = require('util')
const fs = require('fs')

let mainWindow

app.on('ready', () => {
  const htmlPath = path.join('src', 'index.html')
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile(htmlPath)
})

const stat = util.promisify(fs.stat)

ipcMain.on('files', async (event, filesArr) => {
  try {
    const data = await Promise.all(
      filesArr.map(async ({ name, pathName }) => ({
        ...await stat(pathName),
        name,
        pathName
      }))
    )

    mainWindow.webContents.send('metadata', data)
  } catch (error) {
    mainWindow.webContents.send('metadata:error', error)
  }
})
