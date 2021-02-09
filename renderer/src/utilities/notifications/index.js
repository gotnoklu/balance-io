const { ipcRenderer } = global
import { createErrorResponse, createResponse } from '../global'
import { SHOW_APP_NOTIFICATION } from '../../constants/electron-renderer'

export const showAppNotification = async (title, description, message) => {
	const errorResponse = await createErrorResponse('Could not show app notification')
	try {
		const response = await ipcRenderer.invoke(SHOW_APP_NOTIFICATION, {
			title,
			description,
			message,
		})
		if (response.success) {
			return await createResponse(response.data, true)
		}
		return errorResponse
	} catch (error) {
		return errorResponse
	}
}
