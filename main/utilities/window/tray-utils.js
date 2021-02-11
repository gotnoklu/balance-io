import { Tray, Menu, nativeImage } from 'electron'
import path from 'path'

export const createTray = (icon) => {
	return new Tray(nativeImage.createFromPath(path.join(process.resourcesPath, icon)))
}

export const createTrayContextMenu = (tray, menuTemplate) => {
	const contextMenu = Menu.buildFromTemplate(menuTemplate)
	tray.setContextMenu(contextMenu)
}
