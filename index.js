
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



// const electron = require('electron')
// const app = electron.app
// const path = require('path')
// const BrowserWindow = electron.BrowserWindow
// const url = require('url')

// let mainWindow

// function createWindow () {
//     mainWindow = new BrowserWindow({
//         width: 800, 
//         height: 600, 
//         transparent : true,
//         frame:false
//     })

//     mainWindow.setAlwaysOnTop(true);

//     mainWindow.loadURL(url.format({
//         pathname: path.join(__dirname, 'index.html'),
//         protocol: 'file:',
//         slashes: true
//     }))

//     mainWindow.setIgnoreMouseEvents(true);
// }

// // app.on('ready', createWindow)


