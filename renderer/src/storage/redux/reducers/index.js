import { combineReducers } from 'redux'
import appReducer from './app-reducer'
import taskReducer from './task-reducer'
import boardReducer from './board-reducer'
import panelReducer from './panel-reducer'

const defaultReducer = combineReducers( {
	app: appReducer,
	tasks: taskReducer,
	boards: boardReducer,
	panels: panelReducer,
} )

export default defaultReducer
