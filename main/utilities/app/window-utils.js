import { screen, BrowserWindow } from 'electron'
import AppStore from '../../storage/app-store'

export const createWindow = ( windowName, options ) => {
	const key = 'window-state'
	const storeName = `WindowStore-${windowName}`
	const store = new AppStore( storeName )
	const defaultWindowSize = {
		width: options.width,
		height: options.height,
		minWidth: options.minWidth,
		minHeight: options.minHeight,
		maxWidth: options.maxWidth,
		maxHeight: options.maxHeight,
	}

	let state = {}
	let win
	let appIsQuiting = false

	const restore = () => store.get( key )

	const getCurrentPosition = () => {
		const position = win.getPosition()
		const size = win.getSize()
		return {
			x: position[0],
			y: position[1],
			width: size[0],
			height: size[1],
		}
	}

	const saveWindowState = event => {
		if ( !win.isMinimized() && !win.isMaximized() ) {
			store.set( key, state )
		}
	}

	const handleOnMinimize = event => {
		event.preventDefault()
		win.hide()
	}

	const handleOnClose = event => {
		saveWindowState()
		if ( !appIsQuiting ) {
			event.preventDefault()
			win.hide()
			return false
		}
	}

	// ...

	win = new BrowserWindow( {
		...options,
		...state,
		webPreferences: {
			nodeIntegration: true,
			...options.webPreferences,
		},
	} )

	// win.on('minimize', handleOnMinimize)

	// win.on('close', handleOnClose)

	return win
}
