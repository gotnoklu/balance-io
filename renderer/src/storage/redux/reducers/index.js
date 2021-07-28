import { combineReducers } from 'redux'
import appReducer from './app-reducer'
import taskReducer from './tasks-reducer'
import boardReducer from './boards-reducer'
import panelReducer from './panels-reducer'
import projectsReducer from './projects-reducer'
import { defaultReducerActions, persistenceKeys } from '../../../constants/storage'
import { deleteState } from '../../../libraries/store-persistence'

const { ROOT } = persistenceKeys

const reducers = combineReducers( {
	app: appReducer,
	tasks: taskReducer,
	boards: boardReducer,
	panels: panelReducer,
	projects: projectsReducer,
} )

const defaultReducer = ( state, action ) => {
	if ( action.type === defaultReducerActions.RESET_REDUCER ) {
		deleteState( ROOT )
		return reducers( undefined, action )
	}

	return reducers( state, action )
}

export default defaultReducer
