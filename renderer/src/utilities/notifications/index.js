import { ipcRenderer } from 'electron'
import { createErrorResponse } from '../global'
import { SHOW_APP_NOTIFICATION } from '../../constants/electron-renderer'

export const showAppNotification = async (title, description, message) => {
	const errorResponse = await createErrorResponse('Could not show app notification')
	try {
		const response = await ipcRenderer.invoke(SHOW_APP_NOTIFICATION, {
			title,
			description,
			message,
		})
		return response
	} catch (error) {
		return errorResponse
	}
}
