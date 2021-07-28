import { ipcMain, nativeImage, Notification } from 'electron'
import { notificationEvents } from '../constants/events'
import { createResponse, createErrorResponse, createNotificationBody } from '../utilities/global'
import path from 'path'

const handleNotificationEvents = () => {
	const { SHOW_NOTIFICATION } = notificationEvents

	ipcMain.handle( SHOW_NOTIFICATION, ( event, { title, description, message } ) => {
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

export default handleNotificationEvents
