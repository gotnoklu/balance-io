import { ipcRenderer } from 'electron'
import { createErrorResponse } from '../utilities/global'
import { notificationEvents } from '../constants/events'

const { SHOW_NOTIFICATION } = notificationEvents

export const showNotification = async ( title, description, message ) => {
	const errorResponse = await createErrorResponse( 'Could not show app notification' )
	try {
		const response = await ipcRenderer.invoke( SHOW_NOTIFICATION, {
			title,
			description,
			message,
		} )
		return response
	} catch ( error ) {
		return errorResponse
	}
}
