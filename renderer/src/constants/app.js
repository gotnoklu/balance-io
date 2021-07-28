export const isServer = typeof window === 'undefined'

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

export const boardTypes = {
	DEFAULT: 'DEFAULT',
	CUSTOM: 'CUSTOM',
}

export const pageRoutes = {
	INDEX: '/',
	ERROR: '/_error',
	HOME: '/home',
	NO_PROJECTS: '/no-projects',
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

export const backupDelayTimes = [
	{ value: durations.t30m, label: 'Every 30 minutes' },
	{ value: durations.t1h, label: 'Every hour' },
	{ value: durations.t2h, label: 'Every 2 hours' },
	{ value: durations.t3h, label: 'Every 3 hours' },
]
