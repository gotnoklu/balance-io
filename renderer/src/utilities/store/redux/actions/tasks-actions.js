const { createReduxAction } = require('./creators')
import {
	SET_TASKS_STORE,
	DELETE_ALL_TASKS,
	DELETE_MULTIPLE_TASKS,
	DELETE_ONE_TASK,
	SAVE_TASK,
} from './types.js'

const setTasksStore = (store) => createReduxAction(SET_TASKS_STORE, store)

const deleteAllTasks = () => createReduxAction(DELETE_ALL_TASKS)

const deleteMultipleTasks = (tasks) => createReduxAction(DELETE_MULTIPLE_TASKS, tasks)

const deleteTask = (taskId) => createReduxAction(DELETE_ONE_TASK, taskId)

const saveTask = (task) => createReduxAction(SAVE_TASK, task)

export { setTasksStore, deleteAllTasks, deleteMultipleTasks, deleteTask, saveTask }
