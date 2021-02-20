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
}

const compareStates = ( defaultState, oldState, newState ) => {
	const isAllStatesEqual = isEqual( oldState, newState )
	const isNewStateReset = isEqual( newState, defaultState )
	console.log( { defaultState, oldState, newState } )
	if ( isAllStatesEqual || isNewStateReset ) return oldState
	return newState
}

const taskReducer = ( state = defaultTaskState, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = { ...action.payload.tasks }
			return compareStates( defaultTaskState, state, updatedState )
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
