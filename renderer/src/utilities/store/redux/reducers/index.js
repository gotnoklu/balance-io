import { combineReducers } from 'redux'
import appReducer from './app-reducer'
import tasksReducer from './tasks-reducer'

const defaultReducer = combineReducers({ app: appReducer, tasks: tasksReducer })

export default defaultReducer
