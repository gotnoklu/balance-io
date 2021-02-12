import { app } from 'electron'
import serve from 'electron-serve'
import { createWindow, createTray, createTrayContextMenu } from './utilities/app'
import path from 'path'
import AppStore from './utilities/storage/app-store'
import handleRendererProcessEvents from './event-handlers'

const isProduction = process.env.NODE_ENV === 'production'

if ( isProduction ) {
	serve( { directory: 'app' } )
} else {
	app.setPath( 'userData', `${app.getPath( 'userData' )} (development)` )
}

const mainAppStore = new AppStore( {
	storeName: 'MainAppStore',
	defaults: {
		app: {
			theme: 'LIGHT',
			backupType: 'MANUAL',
			autoBackupDelay: null,
		},
		tasks: [],
	},
} )

let mainWindow, tray

const initializeApp = async () => {
	await app.whenReady()

	mainWindow = createWindow( 'main', {
		width: 900,
		height: 700,
		minWidth: 700,
		title: 'Iris',
		icon: path.join( process.resourcesPath, 'favicon.ico' ),
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
			// preload: path.join(__dirname, 'preload.js'),
		},
	} )

	mainWindow.on( 'close', event => {
		if ( !app.isQuiting ) {
			event.preventDefault()
			mainWindow.hide()
			return false
		}
	} )

	tray = createTray( 'tray.png' )
	tray.setToolTip( 'Iris' )
	createTrayContextMenu( tray, [
		{
			label: 'Open Iris',
			click() {
				mainWindow.show()
			},
		},
		{
			label: 'Exit',
			click() {
				app.isQuiting = true
				app.quit()
			},
		},
	] )

	tray.on( 'click', () => {
		mainWindow.show()
	} )

	if ( isProduction ) {
		mainWindow.setMenu( null )
		await mainWindow.loadURL( 'app://./index.html' )
	} else {
		const port = process.argv[2]
		await mainWindow.loadURL( `http://localhost:${port}/` )
		mainWindow.webContents.openDevTools()
	}

	// Set appUserModelId
	app.setAppUserModelId( 'Iris' )
}

// Initialize app
initializeApp()

// Handle all events from renderer process
handleRendererProcessEvents( mainAppStore )

// Quit app after all windows are closed
// app.on('window-all-closed', () => {
// 	app.quit()
// })
