import { ipcMain } from 'electron'
import { storageEvents } from '../constants/events'

const handleStorageEvents = store => {
	const {
		GET_BACKUP_STORAGE,
		GET_FROM_STORAGE,
		GET_STORAGE,
		SAVE_TO_STORAGE,
		BACKUP_STORAGE,
		CLEAR_STORAGE,
		DELETE_FROM_STORAGE,
	} = storageEvents

	// Renderer action handlers
	ipcMain.handle( GET_STORAGE, () => {
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

	ipcMain.handle( DELETE_FROM_STORAGE, ( event, { key } ) => store.delete( key ) )

	ipcMain.handle( CLEAR_STORAGE, () => store.clear() )

	ipcMain.handle( SAVE_TO_STORAGE, ( event, { key, value } ) => store.set( key, value ) )

	ipcMain.handle( GET_FROM_STORAGE, ( event, key ) => store.get( key ) )

	ipcMain.handle( BACKUP_STORAGE, () => store.backupStore() )

	ipcMain.handle( GET_BACKUP_STORAGE, () => store.readFromStoreBackup() )
}

export default handleStorageEvents
