const getAppStore = store => store.app

const getAppTheme = store => getAppStore( store ).theme

const getAppBackupType = store => getAppStore( store ).backupType

const getAppBackupDelay = store => getAppStore( store ).autoBackupDelay

export { getAppStore, getAppTheme, getAppBackupType, getAppBackupDelay }
