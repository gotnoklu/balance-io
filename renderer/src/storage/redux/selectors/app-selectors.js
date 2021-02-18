export const getAppStore = state => state.app

export const getAppTheme = state => getAppStore( state ).theme

export const getAppBackupType = state => getAppStore( state ).backup_type

export const getAppAutoBackupDelay = state => getAppStore( state ).auto_backup_delay

export const getAppSettings = state => getAppStore( state ).settings

export const getAppSettingOptions = state => getAppStore( state ).settings.options

export const getAppSelectedSetting = state => getAppStore( state ).settings.selected
