import { findIndexFromArray } from '../../../utilities/global'
import { projectsReducerActions } from '../../../constants/storage'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const {
	SET_PROJECTS_STORE,
	ADD_PROJECT,
	DELETE_PROJECT,
	DELETE_ALL_PROJECTS,
	DELETE_MULTIPLE_PROJECTS,
	SET_CURRENT_PROJECT_ID,
} = projectsReducerActions

const defaultProjectsStore = {
	current_project_id: null,
	projects_list: [],
}

const compareStates = ( defaultState, oldState, newState ) => {
	const isAllStatesEqual = isEqual( oldState, newState )
	const isNewStateReset = isEqual( newState, defaultState )
	console.log( { defaultState, oldState, newState } )
	if ( isAllStatesEqual || isNewStateReset ) return oldState
	return newState
}

const projectsReducer = ( state = defaultProjectsStore, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = { ...action.payload.projects }
			return compareStates( defaultProjectsStore, state, updatedState )
		}
		case SET_PROJECTS_STORE: {
			return { ...state, ...action.payload }
		}
		case SET_CURRENT_PROJECT_ID: {
			return { ...state, current_project_id: action.payload }
		}
		case DELETE_ALL_PROJECTS: {
			return defaultProjectsStore
		}
		case DELETE_MULTIPLE_PROJECTS: {
			const storedProjects = [...state.projects_list]
			const projectsToBeDeleted = action.payload
			projectsToBeDeleted.forEach( projectId =>
				storedProjects.splice(
					findIndexFromArray( storedProjects, ( { id } ) => id === projectId ),
					1
				)
			)
			return { ...state, projects_list: storedProjects }
		}
		case DELETE_PROJECT: {
			const clonedState = { ...state }
			clonedState.projects_list.splice(
				findIndexFromArray( clonedState.projects, ( { id } ) => id === action.payload ),
				1
			)
			return clonedState
		}
		case ADD_PROJECT: {
			return {
				currentProject: state.currentProject,
				projects_list: state.projects_list.concat( action.payload ),
			}
		}
		default:
			return { ...state }
	}
}

export default projectsReducer
