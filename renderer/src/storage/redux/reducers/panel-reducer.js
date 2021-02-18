import { findIndexFromArray } from '../../../utilities/global'
import { SET_PANEL_STORE, ADD_PANEL, REMOVE_PANEL, REMOVE_ALL_PANELS } from '../actions/types'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const defaultPanelState = { panels: [], _hydrated: false }

const panelReducer = ( state = defaultPanelState, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = { ...action.payload.panels, _hydrated: true }
			if ( isEqual( state, updatedState ) || state._hydrated ) updatedState = state
			return updatedState
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
