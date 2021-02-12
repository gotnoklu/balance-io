const { createReduxAction } = require( './creators' )
import { SET_APP_THEME, SET_APP_BACKUP_TYPE, SET_APP_STORE, SET_APP_BACKUP_DELAY } from './types.js'

const setAppStore = store => createReduxAction( SET_APP_STORE, store )

const setAppStoreTheme = theme => createReduxAction( SET_APP_THEME, theme )

const setAppStoreBackupType = type => createReduxAction( SET_APP_BACKUP_TYPE, type )

const setAppStoreBackupDelay = delay => createReduxAction( SET_APP_BACKUP_DELAY, delay )

export { setAppStoreTheme, setAppStoreBackupType, setAppStore, setAppStoreBackupDelay }
