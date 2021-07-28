import { createObjectClone } from '../../../utilities/global'
import { appReducerActions } from '../../../constants/storage'
import { themeTypes, backupTypes } from '../../../constants/app'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const { SET_APP_THEME_TYPE, SET_APP_BACKUP_TYPE, SET_APP_STORE, SET_APP_AUTO_BACKUP_DELAY } =
	appReducerActions

const defaultAppStore = {
	theme_type: themeTypes.LIGHT,
	backup_type: backupTypes.MANUAL,
	auto_backup_delay: null,
}

const compareStates = ( defaultState, oldState, newState ) => {
	const isAllStatesEqual = isEqual( oldState, newState )
	const isNewStateReset = isEqual( newState, defaultState )
	console.log( { defaultState, oldState, newState } )
	if ( isAllStatesEqual || isNewStateReset ) return oldState
	return newState
}

const appReducer = ( state = defaultAppStore, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = {
				...action.payload.app,
			}
			return compareStates( defaultAppStore, state, updatedState )
		}
		case SET_APP_STORE:
			return createObjectClone( state, action.payload )
		case SET_APP_THEME_TYPE:
			return createObjectClone( state, { theme_type: action.payload } )
		case SET_APP_BACKUP_TYPE:
			return createObjectClone( state, {
				backup_type: action.payload,
			} )
		case SET_APP_AUTO_BACKUP_DELAY:
			return createObjectClone( state, {
				auto_backup_delay: action.payload,
			} )
		default:
			return createObjectClone( state )
	}
}

export default appReducer
