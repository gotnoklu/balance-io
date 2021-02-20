import { createObjectClone } from '../../../utilities/global'
import {
	SET_APP_THEME,
	SET_APP_BACKUP_TYPE,
	SET_APP_STORE,
	SET_APP_AUTO_BACKUP_DELAY,
	SET_APP_SETTINGS,
	SET_APP_SELECTED_SETTING,
} from '../actions/types'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const defaultAppState = {
	theme: null,
	backup_type: null,
	auto_backup_delay: null,
	settings: {
		selected: null,
		options: [],
	},
}

const compareStates = ( defaultState, oldState, newState ) => {
	const isAllStatesEqual = isEqual( oldState, newState )
	const isNewStateReset = isEqual( newState, defaultState )
	console.log( { defaultState, oldState, newState } )
	if ( isAllStatesEqual || isNewStateReset ) return oldState
	return newState
}

const appReducer = ( state = defaultAppState, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = {
				...action.payload.app,
			}
			return compareStates( defaultAppState, state, updatedState )
		}
		case SET_APP_STORE:
			return createObjectClone( state, action.payload )
		case SET_APP_THEME:
			return createObjectClone( state, { theme: action.payload } )
		case SET_APP_BACKUP_TYPE:
			return createObjectClone( state, {
				backup_type: action.payload,
			} )
		case SET_APP_AUTO_BACKUP_DELAY:
			return createObjectClone( state, {
				auto_backup_delay: action.payload,
			} )
		case SET_APP_SETTINGS:
			return createObjectClone( state, {
				settings: action.payload,
			} )
		case SET_APP_SELECTED_SETTING:
			return createObjectClone( state, {
				settings: { selected: action.payload, options: state.settings.options },
			} )
		default:
			return createObjectClone( state )
	}
}

export default appReducer
