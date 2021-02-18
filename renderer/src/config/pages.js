import { pageRoutes } from '../constants'

export const pageConfig = {
	INDEX: {
		header: false,
		drawer: false,
	},
	ERROR: {
		header: false,
		drawer: false,
	},
	HOME: {
		header: true,
		drawer: true,
	},
	SETTINGS: {
		header: true,
		drawer: false,
	},
	APP_SETTINGS: {
		header: true,
		drawer: false,
	},
	BOARDS: {
		header: true,
		drawer: false,
	},
	BOARD_SETTINGS: {
		header: true,
		drawer: false,
	},
}

export const pageConfigByRoute = {
	[pageRoutes.INDEX]: pageConfig.INDEX,
	[pageRoutes.ERROR]: pageConfig.ERROR,
	[pageRoutes.HOME]: pageConfig.HOME,
	[pageRoutes.SETTINGS]: pageConfig.SETTINGS,
	[pageRoutes.APP_SETTINGS]: pageConfig.APP_SETTINGS,
	[pageRoutes.BOARDS]: pageConfig.BOARDS,
	[pageRoutes.BOARD_SETTINGS]: pageConfig.BOARD_SETTINGS,
}
