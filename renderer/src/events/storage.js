import electron from 'electron'
import { createErrorResponse } from '../utilities/global'
import { storageEvents } from '../constants/events'

const {
	SAVE_TO_STORAGE,
	GET_STORAGE,
	DELETE_FROM_STORAGE,
	CLEAR_STORAGE,
	GET_BACKUP_STORAGE,
	BACKUP_STORAGE,
	GET_FROM_STORAGE,
} = storageEvents

const ipcRenderer = electron.ipcRenderer || false

export const getStorage = async () => {
	const nullStoreErrorResponse = await createErrorResponse( { message: 'Storage is empty.' } )
	const errorResponse = await createErrorResponse( { message: 'Could not get data from storage.' } )
	try {
		if ( ipcRenderer ) {
			const data = await ipcRenderer.invoke( GET_STORAGE )
			if ( data.success ) {
				return data
			}
			return nullStoreErrorResponse
		}
	} catch ( error ) {
		return errorResponse
	}
}

export const saveToStorage = async ( key, value ) => {
	const data = await ipcRenderer.invoke( SAVE_TO_STORAGE, { key, value } )
	return data
}

export const deleteFromStorage = async key => {
	const data = await ipcRenderer.invoke( DELETE_FROM_STORAGE, key )
	return data
}

export const clearStorage = async () => {
	const data = await ipcRenderer.invoke( CLEAR_STORAGE )
	return data
}

export const getFromStorage = async key => {
	const data = await ipcRenderer.invoke( GET_FROM_STORAGE, key )
	return data
}

export const backupStorage = async () => {
	const data = await ipcRenderer.invoke( BACKUP_STORAGE )
	return data
}

export const getBackupStorage = async () => {
	const data = await ipcRenderer.invoke( GET_BACKUP_STORAGE )
	return data
}
