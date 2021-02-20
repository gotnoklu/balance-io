import { ipcMain, nativeImage, Notification } from 'electron'
import {
	GET_BACKUP_MAIN_APP_STORE,
	GET_FROM_MAIN_APP_STORE,
	GET_MAIN_APP_STORE,
	SAVE_TO_MAIN_APP_STORE,
	SET_BACKUP_MAIN_APP_STORE,
	SHOW_APP_NOTIFICATION,
	CLEAR_MAIN_APP_STORE,
	DELETE_FROM_MAIN_APP_STORE,
} from './constants'
import { createResponse, createErrorResponse, createNotificationBody } from './utilities/global'
import path from 'path'

const handleRendererProcessEvents = store => {
	// Renderer action handlers
	ipcMain.handle( GET_MAIN_APP_STORE, () => {
		const storeResponse = store.getAll()

		if ( storeResponse.success ) return storeResponse

		const { success, response } = store.readFromStoreBackup()
		if ( success ) {
			store.setStore( response.data )
			return response
		} else {
			try {
				store.setStore( {} )
				return store.getAll()
			} catch ( error ) {
				console.log( error )
			}
		}
	} )

	ipcMain.handle( DELETE_FROM_MAIN_APP_STORE, ( event, { key } ) => store.delete( key ) )

	ipcMain.handle( CLEAR_MAIN_APP_STORE, () => store.clear() )

	ipcMain.handle( SAVE_TO_MAIN_APP_STORE, ( event, { key, value } ) => store.set( key, value ) )

	ipcMain.handle( GET_FROM_MAIN_APP_STORE, ( event, key ) => store.get( key ) )

	ipcMain.handle( SET_BACKUP_MAIN_APP_STORE, () => store.backupStore() )

	ipcMain.handle( GET_BACKUP_MAIN_APP_STORE, () => store.readFromStoreBackup() )

	ipcMain.handle( SHOW_APP_NOTIFICATION, ( event, { title, description, message } ) => {
		try {
			if ( Notification.isSupported() ) {
				const icon = nativeImage.createFromPath(
					path.join( process.resourcesPath, 'notification.png' )
				)
				const notificationBody = createNotificationBody(
					title,
					description,
					message,
					icon,
					'critical',
					'never'
				)
				const notification = new Notification( notificationBody )
				notification.show()
				return createResponse( 'Notification success!', true )
			}
		} catch ( error ) {
			return createErrorResponse( 'Could not show app notification.' )
		}
	} )
}

export default handleRendererProcessEvents
