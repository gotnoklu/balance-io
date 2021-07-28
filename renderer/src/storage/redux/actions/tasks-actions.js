import { createReduxAction } from '../../../utilities/storage/redux'
import { tasksReducerActions } from '../../../constants/storage'

const { SET_TASKS_STORE, DELETE_ALL_TASKS, DELETE_MULTIPLE_TASKS, DELETE_ONE_TASK, ADD_TASK } =
	tasksReducerActions

export const setTasksStore = store => createReduxAction( SET_TASKS_STORE, store )

export const deleteAllTasks = () => createReduxAction( DELETE_ALL_TASKS )

export const deleteMultipleTasks = tasksList => createReduxAction( DELETE_MULTIPLE_TASKS, tasksList )

export const deleteTask = taskId => createReduxAction( DELETE_ONE_TASK, taskId )

export const saveTask = task => createReduxAction( ADD_TASK, task )
