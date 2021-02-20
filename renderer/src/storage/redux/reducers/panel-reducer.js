import { findIndexFromArray } from '../../../utilities/global'
import { SET_PANEL_STORE, ADD_PANEL, REMOVE_PANEL, REMOVE_ALL_PANELS } from '../actions/types'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const defaultPanelState = { panels: [] }

const compareStates = ( defaultState, oldState, newState ) => {
	const isAllStatesEqual = isEqual( oldState, newState )
	const isNewStateReset = isEqual( newState, defaultState )
	console.log( { defaultState, oldState, newState } )
	if ( isAllStatesEqual || isNewStateReset ) return oldState
	return newState
}

const panelReducer = ( state = defaultPanelState, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = { ...action.payload.panels }
			return compareStates( defaultPanelState, state, updatedState )
		}
		case SET_PANEL_STORE: {
			return { ...state, panels: [...action.payload] }
		}
		case REMOVE_ALL_PANELS: {
			return { ...state, panels: [] }
		}
		case REMOVE_PANEL: {
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

export default panelReducer
