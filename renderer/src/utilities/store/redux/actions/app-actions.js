const { createReduxAction } = require('./creators')
import { SET_APP_THEME, SET_APP_BACKUP_TYPE, SET_APP_STORE } from './types.js'

const setAppStore = (store) => createReduxAction(SET_APP_STORE, store)

const setAppStoreTheme = (theme) => createReduxAction(SET_APP_THEME, theme)

const setAppStoreBackupType = (type) => createReduxAction(SET_APP_BACKUP_TYPE, type)

export { setAppStoreTheme, setAppStoreBackupType, setAppStore }
