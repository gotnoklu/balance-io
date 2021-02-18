import { findIndexFromArray } from '../../../utilities/global'
import {
	SET_TASKS_STORE,
	DELETE_ALL_TASKS,
	DELETE_MULTIPLE_TASKS,
	DELETE_ONE_TASK,
	SAVE_TASK,
} from '../actions/types'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const defaultTaskState = {
	tasks: [],
	_hydrated: false,
}

const taskReducer = ( state = defaultTaskState, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = { ...action.payload.tasks, _hydrated: true }
			if ( isEqual( state, updatedState ) || state._hydrated ) updatedState = state
			return updatedState
		}
		case SET_TASKS_STORE: {
			return { ...state, tasks: [...action.payload] }
		}
		case DELETE_ALL_TASKS: {
			return { ...state, tasks: [] }
		}
		case DELETE_MULTIPLE_TASKS: {
			const storedTasks = [...state.tasks]
			const tasksToBeDeleted = action.payload
			tasksToBeDeleted.forEach( taskId =>
				storedTasks.splice(
					findIndexFromArray( storedTasks, ( { id } ) => id === taskId ),
					1
				)
			)
			return { ...state, tasks: storedTasks }
		}
		case DELETE_ONE_TASK: {
			const clonedState = [...state.tasks]
			clonedState.splice(
				findIndexFromArray( state, ( { id } ) => id === action.payload ),
				1
			)
			return { ...state, tasks: clonedState }
		}
		case SAVE_TASK: {
			return { ...state, tasks: state.tasks.concat( action.payload ) }
		}
		default:
			return { ...state }
	}
}

export default taskReducer
