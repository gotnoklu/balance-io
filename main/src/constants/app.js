export const isProduction = process.env.NODE_ENV === 'production'

export const defaultStorageData = {
	app: {
		theme: 'LIGHT',
		backup_type: 'MANUAL',
		auto_backup_delay: null,
	},
	projects: { current_project_id: null, projects_list: [] },
	boards: { current_board_id: null, boards_list: [] },
	panels: [],
	tasks: [],
}
