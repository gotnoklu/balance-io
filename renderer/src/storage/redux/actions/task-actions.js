import { createReduxAction } from './creators'
import {
	SET_TASKS_STORE,
	DELETE_ALL_TASKS,
	DELETE_MULTIPLE_TASKS,
	DELETE_ONE_TASK,
	SAVE_TASK,
} from './types.js'

export const setTaskStore = store => createReduxAction( SET_TASKS_STORE, store )

export const deleteAllTasks = () => createReduxAction( DELETE_ALL_TASKS )

export const deleteMultipleTasks = tasks => createReduxAction( DELETE_MULTIPLE_TASKS, tasks )

export const deleteTask = taskId => createReduxAction( DELETE_ONE_TASK, taskId )

export const saveTask = task => createReduxAction( SAVE_TASK, task )
