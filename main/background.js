import { app } from 'electron'
import serve from 'electron-serve'
import { createWindow, createTray, createTrayContextMenu } from './utilities/app'
import path from 'path'
import AppStore from './storage/app-store'
import handleRendererProcessEvents from './event-handlers'

const isProduction = process.env.NODE_ENV === 'production'

if ( isProduction ) {
	serve( { directory: 'app' } )
} else {
	app.setPath( 'userData', `${app.getPath( 'userData' )} (development)` )
}

// Initialize app storage
const initialStoreData = {
	app: {
		theme: 'LIGHT',
		backup_type: 'MANUAL',
		auto_backup_delay: null,
		settings: {
			options: ['SETTINGS', 'APP_SETTINGS', 'BOARD_SETTINGS'],
		},
	},
	iris: {
		boards: {
			current_board: null,
			boards: [],
		},
		panels: [],
		tasks: [],
	},
}
const storage = new AppStore( 'MainAppStore', initialStoreData )

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
			devTools: isProduction ? false : true,
		},
	} )

	mainWindow.on( 'close', event => {
		if ( !app.isQuitting ) {
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
	app.setAppUserModelId( 'Iris' )
}

// Initialize app
initializeApp().catch( error => {
	console.log( error )
} )

// Handle all events from renderer process
handleRendererProcessEvents( storage )
