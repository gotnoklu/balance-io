import { createObjectClone } from '../../../global'
import { SET_APP_THEME, SET_APP_BACKUP_TYPE, SET_APP_STORE } from '../actions/types'
import { HYDRATE } from 'next-redux-wrapper'

const defaultAppState = {
	theme: null,
	backupType: null,
}

const appReducer = (state = defaultAppState, action) => {
	switch (action.type) {
		case HYDRATE: {
			const nextState = {
				...state,
				...action.payload.app,
			}
			if (state.theme) nextState.theme = state.theme
			return nextState
		}
		case SET_APP_STORE:
			return createObjectClone(state, action.payload)
		case SET_APP_THEME:
			return createObjectClone(state, { theme: action.payload })
		case SET_APP_BACKUP_TYPE:
			return createObjectClone(state, {
				backupType: action.payload,
			})
		default:
			return createObjectClone(state)
	}
}

export default appReducer
