import { createReduxAction } from '../../../utilities/storage/redux'
import { appReducerActions } from '../../../constants/storage'

const { SET_APP_THEME_TYPE, SET_APP_BACKUP_TYPE, SET_APP_STORE, SET_APP_AUTO_BACKUP_DELAY } =
	appReducerActions

export const setAppStore = store => createReduxAction( SET_APP_STORE, store )

export const setAppThemeType = themeType => createReduxAction( SET_APP_THEME_TYPE, themeType )

export const setAppBackupType = backupType => createReduxAction( SET_APP_BACKUP_TYPE, backupType )

export const setAppAutoBackupDelay = autoBackupDelay =>
	createReduxAction( SET_APP_AUTO_BACKUP_DELAY, autoBackupDelay )
