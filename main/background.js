import { app } from 'electron'
import serve from 'electron-serve'
import { createWindow, createTray, createTrayContextMenu } from './src/utilities/app'
import path from 'path'
import AppStore from './src/libraries/app-store'
import handleWindowEvents from './src/events/window'
import handleStorageEvents from './src/events/storage'
import handleNotificationEvents from './src/events/notifications'
import { isProduction, defaultStorageData } from './src/constants/app'

if ( isProduction ) {
	serve( { directory: 'app' } )
} else {
	app.setPath( 'userData', `${app.getPath( 'userData' )} (development)` )
}

const store = new AppStore( 'Store', defaultStorageData )

let mainWindow, tray

const initializeApp = async () => {
	await app.whenReady()

	mainWindow = await createWindow( {
		width: 900,
		height: 700,
		minWidth: 700,
		title: 'Balance.io',
		icon: path.join( process.resourcesPath, 'favicon.ico' ),
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			devTools: isProduction ? false : true,
			contextIsolation: false,
		},
	} )

	handleWindowEvents( mainWindow )

	mainWindow.on( 'close', event => {
		if ( !app.isQuitting ) {
			event.preventDefault()
			mainWindow.hide()
			return false
		}
	} )

	tray = createTray( 'tray.png' )
	tray.setToolTip( 'Balance.io' )
	createTrayContextMenu( tray, [
		{
			label: 'Open Balance.io',
			click: () => {
				mainWindow.show()
			},
		},
		{
			label: 'Exit',
			click: () => {
				app.isQuitting = true
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
		const port = await process.argv[2]
		await mainWindow.loadURL( `http://localhost:${port}/` )
		mainWindow.webContents.openDevTools()
	}

	// Set appUserModelId
	app.setAppUserModelId( 'Balance.io' )
}

// Initialize app

initializeApp().catch( error => {
	console.log( error )
} )

handleStorageEvents( store )
handleNotificationEvents()
