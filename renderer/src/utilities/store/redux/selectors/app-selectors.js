const getAppStore = (store) => store.app

const getAppTheme = (store) => getAppStore(store).theme

const getAppBackupType = (store) => getAppStore(store).backupType

export { getAppStore, getAppTheme, getAppBackupType }
