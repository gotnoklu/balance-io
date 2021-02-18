import { createReduxAction } from './creators'
import {
	SET_APP_THEME,
	SET_APP_BACKUP_TYPE,
	SET_APP_STORE,
	SET_APP_AUTO_BACKUP_DELAY,
	SET_APP_SETTINGS,
	SET_APP_SELECTED_SETTING,
} from './types.js'

export const setAppStore = store => createReduxAction( SET_APP_STORE, store )

export const setAppTheme = theme => createReduxAction( SET_APP_THEME, theme )

export const setAppBackupType = type => createReduxAction( SET_APP_BACKUP_TYPE, type )

export const setAppAutoBackupDelay = delay => createReduxAction( SET_APP_AUTO_BACKUP_DELAY, delay )

export const setAppSettings = settings => createReduxAction( SET_APP_SETTINGS, settings )

export const setAppSelectedSetting = setting => createReduxAction( SET_APP_SELECTED_SETTING, setting )
