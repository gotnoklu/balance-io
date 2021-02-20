import { ipcRenderer } from 'electron'
import { createErrorResponse } from '../../utilities/global'
import {
	SAVE_TO_MAIN_APP_STORE,
	GET_MAIN_APP_STORE,
	DELETE_FROM_MAIN_APP_STORE,
	CLEAR_MAIN_APP_STORE,
	GET_BACKUP_MAIN_APP_STORE,
	SET_BACKUP_MAIN_APP_STORE,
	GET_FROM_MAIN_APP_STORE,
} from '../../constants/electron-renderer'

export const getMainAppStore = async () => {
	const nullStoreErrorResponse = await createErrorResponse( { message: 'Main app store is empty.' } )
	const errorResponse = await createErrorResponse( { message: 'Could not get main app store.' } )
	try {
		const data = await ipcRenderer.invoke( GET_MAIN_APP_STORE )
		if ( data.success ) {
			return data
		}
		return nullStoreErrorResponse
	} catch ( error ) {
		return errorResponse
	}
}

export const saveToMainAppStore = async ( key, value ) => {
	const data = await ipcRenderer.invoke( SAVE_TO_MAIN_APP_STORE, { key, value } )
	return data
}

export const deleteFromMainAppStore = async key => {
	const data = await ipcRenderer.invoke( DELETE_FROM_MAIN_APP_STORE, key )
	return data
}

export const clearMainAppStore = async () => {
	const data = await ipcRenderer.invoke( CLEAR_MAIN_APP_STORE )
	return data
}

export const getFromMainAppStore = async key => {
	const data = await ipcRenderer.invoke( GET_FROM_MAIN_APP_STORE, key )
	return data
}

export const backupMainAppStore = async () => {
	const data = await ipcRenderer.invoke( SET_BACKUP_MAIN_APP_STORE )
	return data
}

export const getBackupMainAppStore = async () => {
	const data = await ipcRenderer.invoke( GET_BACKUP_MAIN_APP_STORE )
	return data
}
