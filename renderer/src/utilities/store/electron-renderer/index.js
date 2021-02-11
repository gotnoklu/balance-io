import { ipcRenderer } from 'electron'
import { createErrorResponse, createResponse } from '../../global'
import {
	SAVE_TO_MAIN_APP_STORE,
	GET_MAIN_APP_STORE,
	DELETE_FROM_MAIN_APP_STORE,
	CLEAR_MAIN_APP_STORE,
	GET_BACKUP_MAIN_APP_STORE,
	SET_BACKUP_MAIN_APP_STORE,
	GET_FROM_MAIN_APP_STORE,
} from '../../../constants/electron-renderer'

export const getMainAppStore = async () => {
	const nullStoreErrorResponse = await createErrorResponse('Main app store is empty.')
	const errorResponse = await createErrorResponse('Could not get main app store.')
	try {
		const response = await ipcRenderer.invoke(GET_MAIN_APP_STORE)
		if (response.success) {
			return await createResponse(response.data, true)
		}
		return nullStoreErrorResponse
	} catch (error) {
		return errorResponse
	}
}

export const saveToMainAppStore = async (key, value) => {
	const errorResponse = await createErrorResponse('Could not save to main app store.')
	try {
		const response = await ipcRenderer.invoke(SAVE_TO_MAIN_APP_STORE, { key, value })
		if (response.success) {
			return await createResponse(response.data, true)
		}
		return errorResponse
	} catch (error) {
		return errorResponse
	}
}

export const deleteFromMainAppStore = async (key) => {
	const errorResponse = await createErrorResponse('Could not delete from main app store.')
	try {
		const response = await ipcRenderer.invoke(DELETE_FROM_MAIN_APP_STORE, key)
		if (response.success) {
			return await createResponse(response.data, true)
		}
		return errorResponse
	} catch (error) {
		return errorResponse
	}
}

export const clearMainAppStore = async () => {
	const errorResponse = await createErrorResponse('Could not clear main app store.')
	try {
		const response = await ipcRenderer.invoke(CLEAR_MAIN_APP_STORE)
		if (response.success) {
			return await createResponse(response.data, true)
		}
		return errorResponse
	} catch (error) {
		return errorResponse
	}
}

export const getFromMainAppStore = async (key) => {
	const errorResponse = await createErrorResponse('Could not get from main app store.')
	try {
		const response = await ipcRenderer.invoke(GET_FROM_MAIN_APP_STORE, key)
		if (response.success) {
			return await createResponse(response.data, true)
		}
		return errorResponse
	} catch (error) {
		return errorResponse
	}
}

export const backupMainAppStore = async () => {
	const errorResponse = await createErrorResponse('Could not backup main app store.')
	try {
		const response = await ipcRenderer.invoke(SET_BACKUP_MAIN_APP_STORE)
		if (response.success) {
			return await createResponse(response.data, true)
		}
		return errorResponse
	} catch (error) {
		return errorResponse
	}
}

export const getBackupMainAppStore = async () => {
	const errorResponse = await createErrorResponse('Could not get backup of main app store.')
	try {
		const response = await ipcRenderer.invoke(GET_BACKUP_MAIN_APP_STORE)
		if (response.success) {
			return await createResponse(response.data, true)
		}
		return errorResponse
	} catch (error) {
		return errorResponse
	}
}
