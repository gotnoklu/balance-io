import { ipcMain } from 'electron'
import { windowEvents } from '../constants/events'
import { createErrorResponse, createSuccessResponse } from '../utilities/global'

const handleWindowEvents = window => {
	const { CLOSE_WINDOW, MAXIMIZE_WINDOW, MINIMIZE_WINDOW, RESTORE_WINDOW, IS_WINDOW_MAXIMIZED } =
		windowEvents

	ipcMain.handle( CLOSE_WINDOW, () => {
		try {
			window.close()
			return createSuccessResponse( 'Window closed.' )
		} catch ( error ) {
			return createErrorResponse( `Window not closed: ${error}` )
		}
	} )

	ipcMain.handle( MINIMIZE_WINDOW, () => {
		try {
			window.minimize()
			return createSuccessResponse( 'Window minimized.' )
		} catch ( error ) {
			return createErrorResponse( `Window not minimized: ${error}` )
		}
	} )

	ipcMain.handle( RESTORE_WINDOW, () => {
		try {
			window.restore()
			return createSuccessResponse( 'Window restored.' )
		} catch ( error ) {
			return createErrorResponse( `Window not restored: ${error}` )
		}
	} )

	ipcMain.handle( MAXIMIZE_WINDOW, () => {
		try {
			window.maximize()
			return createSuccessResponse( 'Window maximized.' )
		} catch ( error ) {
			return createErrorResponse( `Window not maximized: ${error}` )
		}
	} )

	ipcMain.handle( IS_WINDOW_MAXIMIZED, () => {
		try {
			return window.isMaximized()
		} catch ( error ) {
			return createErrorResponse( `Error: ${error}` )
		}
	} )
}

export default handleWindowEvents
