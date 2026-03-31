const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const _serve = require('electron-serve')
const serve = _serve.default || _serve


const webDir = path.join(__dirname, 'dist');
const loadURL = serve({ directory: webDir })

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Con electron-serve, ya podemos dejar la seguridad web nativa encendida
      webSecurity: true,
    }
  })

  // Carga tu app web desde la carpeta de construcción (como si fuera un servidor real)
  loadURL(win).then(() => {
    // Abre las herramientas de desarrollo para validar que todo funcione si lo deseas
    //win.webContents.openDevTools()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
