export const getAppStore = state => state.app

export const getAppThemeType = state => getAppStore( state ).theme_type

export const getAppBackupType = state => getAppStore( state ).backup_type

export const getAppAutoBackupDelay = state => getAppStore( state ).auto_backup_delay
