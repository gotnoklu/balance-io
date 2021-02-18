export const drawerWidth = 260

export const themeTypes = {
	LIGHT: 'LIGHT',
	DARK: 'DARK',
}

export const backupTypes = {
	AUTO: 'AUTO',
	MANUAL: 'MANUAL',
}

export const taskTypes = {
	REGULAR: 'REGULAR',
	REMINDER: 'REMINDER',
}

export const storageKeys = {
	APP: 'app',
	THEME: 'app.theme',
	BACKUP_TYPE: 'app.backup_type',
	AUTO_BACKUP_DELAY: 'app.auto_backup_delay',
	IRIS: 'iris',
	BOARDS: 'iris.boards',
	CURRENT_BOARD: 'iris.boards.current_board',
	BOARDS_LIST: 'iris.boards.boards',
	PANELS: 'iris.panels',
	TASKS: 'iris.tasks',
}

export const boardTypes = {
	DEFAULT: 'DEFAULT',
	CUSTOM: 'CUSTOM',
}

export const settingTypes = {
	SETTINGS: 'SETTINGS',
	APP: 'APP_SETTINGS',
	BOARD: 'BOARD_SETTINGS',
}

export const pageRoutes = {
	INDEX: '/',
	ERROR: '/_error',
	HOME: '/home',
	SETTINGS: '/settings',
	APP_SETTINGS: '/settings/app',
	BOARDS: '/settings/boards',
	BOARD_SETTINGS: '/settings/boards/[board_id]',
	PANELS: '/settings/boards/panels',
}

export const durations = {
	t0s: '0s',
	t1h: '1h',
	t2h: '2h',
	t3h: '3h',
	t10m: '10m',
	t20m: '20m',
	t30m: '30m',
	t40m: '40m',
	t50m: '50m',
}
