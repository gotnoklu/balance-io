// Native
const { format } = require('url')
const path = require('path')

// Packages
const { BrowserWindow, app, ipcMain, Menu, Tray, Notification, nativeImage } = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const {
	createNotificationBody,
	createId,
	createResponse,
	createErrorResponse,
} = require('../utilities/global')
const AppStore = require('../utilities/storage/app-store')
const {
	GET_MAIN_APP_STORE,
	SAVE_TO_MAIN_APP_STORE,
	DELETE_FROM_MAIN_APP_STORE,
	CLEAR_MAIN_APP_STORE,
	GET_BACKUP_MAIN_APP_STORE,
	SET_BACKUP_MAIN_APP_STORE,
	SHOW_APP_NOTIFICATION,
	GET_FROM_MAIN_APP_STORE,
} = require('../utilities/storage/electron/types')

let mainWindow, devtools, tray

const mainAppStore = new AppStore({
	storeName: 'MainAppStore',
	directory: 'Store',
	backupDir: 'Iris',
	storeKey: createId(32),
	defaults: {
		app: {
			theme: 'LIGHT',
			backupType: 'MANUAL',
		},
		tasks: [],
	},
})

// Prepare the renderer once the app is ready
app.once('ready', async () => {
	await prepareNext('renderer', 8000)

	mainWindow = new BrowserWindow({
		width: 900,
		height: 700,
		minWidth: 700,
		title: 'Iris',
		icon: '../build/icon.png',
		webPreferences: {
			nodeIntegration: false,
			devTools: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	mainWindow.on('minimize', function (event) {
		event.preventDefault()
		mainWindow.hide()
	})

	mainWindow.on('close', function (event) {
		if (!app.isQuiting) {
			event.preventDefault()
			mainWindow.hide()
		}
		return false
	})

	tray = new Tray(nativeImage.createFromPath(path.join(process.resourcesPath, 'tray.png')))
	const contextMenu = Menu.buildFromTemplate([
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
	])
	tray.setToolTip('Iris')
	tray.setContextMenu(contextMenu)
	tray.on('click', () => {
		mainWindow.show()
	})

	// Set path for development files
	const devPath = 'http://localhost:8000/index'

	// Set path for production files
	const prodPath = format({
		pathname: path.join(__dirname, '../renderer/out/index/index.html'),
		protocol: 'file:',
		slashes: true,
	})

	// Set window url based on mode
	const url = isDev ? devPath : prodPath
	mainWindow.loadURL(url)

	// if (isDev) {
	devtools = new BrowserWindow({
		width: 600,
		height: 700,
		title: 'Developer Tools',
	})
	const webContents = mainWindow.webContents
	webContents.setDevToolsWebContents(devtools.webContents)
	webContents.openDevTools({ mode: 'detach' })
	app.setAppUserModelId('Iris')
	// }

	if (!isDev) {
		mainWindow.setMenu(null)
	}
})

// Renderer action handlers
ipcMain.handle(GET_MAIN_APP_STORE, () => mainAppStore.getAll())

ipcMain.handle(DELETE_FROM_MAIN_APP_STORE, (event, { key }) => mainAppStore.delete(key))

ipcMain.handle(CLEAR_MAIN_APP_STORE, () => mainAppStore.clear())

ipcMain.handle(SAVE_TO_MAIN_APP_STORE, (event, { key, value }) => {
	const setResponse = mainAppStore.set(key, value)
	if (setResponse.success) {
		return mainAppStore.getAll()
	}
	return setResponse
})

ipcMain.handle(GET_FROM_MAIN_APP_STORE, (event, key) => mainAppStore.get(key))

ipcMain.handle(SET_BACKUP_MAIN_APP_STORE, () => mainAppStore.backup())

ipcMain.handle(GET_BACKUP_MAIN_APP_STORE, () => mainAppStore.readFromBackup())

ipcMain.handle(SHOW_APP_NOTIFICATION, (event, { title, description, message }) => {
	try {
		if (Notification.isSupported()) {
			const icon = nativeImage.createFromPath(path.join(process.resourcesPath, 'notification.png'))
			const notificationBody = createNotificationBody(
				title,
				description,
				message,
				icon,
				'critical',
				'never'
			)
			const notification = new Notification(notificationBody)
			notification.show()
			return createResponse('Notification success!', true)
		}
	} catch (error) {
		return createErrorResponse('Could not show app notification.')
	}
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)
