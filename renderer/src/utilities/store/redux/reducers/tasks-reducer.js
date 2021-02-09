import { findIndexFromArray } from '../../../global'
import {
	SET_TASKS_STORE,
	DELETE_ALL_TASKS,
	DELETE_MULTIPLE_TASKS,
	DELETE_ONE_TASK,
	SAVE_TASK,
} from '../actions/types'
import { HYDRATE } from 'next-redux-wrapper'

const defaultTasksState = []

const tasksReducer = (state = defaultTasksState, action) => {
	switch (action.type) {
		case HYDRATE: {
			let updatedState = [...state, ...action.payload.tasks]
			if (state === updatedState) {
				updatedState = state
			}
			return updatedState
		}
		case SET_TASKS_STORE: {
			return [...action.payload]
		}
		case DELETE_ALL_TASKS: {
			return []
		}
		case DELETE_MULTIPLE_TASKS: {
			const storedTasks = [...state]
			const tasksToBeDeleted = action.payload
			tasksToBeDeleted.forEach((taskId) =>
				storedTasks.splice(
					findIndexFromArray(storedTasks, ({ id }) => id === taskId),
					1
				)
			)
			return storedTasks
		}
		case DELETE_ONE_TASK: {
			return state.splice(
				findIndexFromArray(state, ({ id }) => id === action.payload),
				1
			)
		}
		case SAVE_TASK: {
			return state.concat(action.payload)
		}
		default:
			return [...state]
	}
}

export default tasksReducer
