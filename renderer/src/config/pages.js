import { pageRoutes } from '../constants/app'

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
	NO_PROJECTS: {
		header: false,
		drawer: true,
	},
}

export const pageConfigByRoute = {
	[pageRoutes.INDEX]: pageConfig.INDEX,
	[pageRoutes.ERROR]: pageConfig.ERROR,
	[pageRoutes.HOME]: pageConfig.HOME,
	[pageRoutes.NO_PROJECTS]: pageConfig.NO_PROJECTS,
}
