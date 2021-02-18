export const getTasksStore = state => state.tasks

export const getTasksByPanel = panel => state => {
	const taskStore = getTasksStore( state ).tasks
	return taskStore.filter( task => task.panel === panel )
}
