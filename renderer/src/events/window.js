import electron from 'electron'
import { windowEvents } from '../constants/events'

const { CLOSE_WINDOW, MINIMIZE_WINDOW, MAXIMIZE_WINDOW, RESTORE_WINDOW, IS_WINDOW_MAXIMIZED } =
	windowEvents

const ipcRenderer = electron.ipcRenderer || false

export const closeWindow = async () => {
	if ( ipcRenderer ) {
		const result = await ipcRenderer.invoke( CLOSE_WINDOW )
		return result
	}
}

export const minimizeWindow = async () => {
	if ( ipcRenderer ) {
		const result = await ipcRenderer.invoke( MINIMIZE_WINDOW )
		return result
	}
}

export const maximizeWindow = async () => {
	if ( ipcRenderer ) {
		const result = await ipcRenderer.invoke( MAXIMIZE_WINDOW )
		return result
	}
}

export const restoreWindow = async () => {
	if ( ipcRenderer ) {
		const result = await ipcRenderer.invoke( RESTORE_WINDOW )
		return result
	}
}

export const isWindowMaximized = async () => {
	if ( ipcRenderer ) {
		const result = await ipcRenderer.invoke( IS_WINDOW_MAXIMIZED )
		return result
	}
}
