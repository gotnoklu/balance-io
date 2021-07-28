export const getTasksStore = state => state.tasks

export const getTasksByPanelId = panel_id => state => {
	const taskStore = getTasksStore( state ).tasks
	return taskStore.filter( task => task.panel_id === panel_id )
}
