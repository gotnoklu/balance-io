import { findIndexFromArray } from '../../../utilities/global'
import { panelsReducerActions } from '../../../constants/storage'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const { SET_PANELS_STORE, ADD_PANEL, DELETE_PANEL, DELETE_ALL_PANELS, DELETE_MULTIPLE_PANELS } =
	panelsReducerActions

const defaultPanelsStore = { panels: [] }

const compareStates = ( defaultState, oldState, newState ) => {
	const isAllStatesEqual = isEqual( oldState, newState )
	const isNewStateReset = isEqual( newState, defaultState )
	console.log( { defaultState, oldState, newState } )
	if ( isAllStatesEqual || isNewStateReset ) return oldState
	return newState
}

const panelsReducer = ( state = defaultPanelsStore, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = { ...action.payload.panels }
			return compareStates( defaultPanelsStore, state, updatedState )
		}
		case SET_PANELS_STORE: {
			return { ...state, panels: [...action.payload] }
		}
		case DELETE_ALL_PANELS: {
			return { ...state, panels: [] }
		}
		case DELETE_MULTIPLE_PANELS: {
			const storedPanels = [...state.panels]
			const panelsToBeDeleted = action.payload
			panelsToBeDeleted.forEach( panelId =>
				storedPanels.splice(
					findIndexFromArray( storedPanels, ( { id } ) => id === panelId ),
					1
				)
			)
			return { ...state, panels: storedPanels }
		}
		case DELETE_PANEL: {
			const clonedPanels = [...state.panels]
			clonedPanels.splice(
				findIndexFromArray( clonedPanels, ( { id } ) => id === action.payload ),
				1
			)
			return { ...state, panels: clonedPanels }
		}
		case ADD_PANEL: {
			return { ...state, panels: state.panels.concat( action.payload ) }
		}
		default:
			return { ...state }
	}
}

export default panelsReducer
