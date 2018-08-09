
const electron = require('electron')
const path = require('path')
const url = require('url')
const {app, BrowserWindow, protocol} = electron
let mainWindow

app.disableHardwareAcceleration()

app.on('ready', () => {
	protocol.unregisterProtocol('', () => {
		mainWindow = new BrowserWindow({
			width: 800,
			height: 600,
			frame: false,
			transparent: true
		})
		mainWindow.setAlwaysOnTop(true);

		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		}))

		// mainWindow.setFullScreen(true);
		mainWindow.maximize();
		mainWindow.setIgnoreMouseEvents(true);
	})
})

