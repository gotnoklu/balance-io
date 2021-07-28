import { createReduxAction } from '../../../utilities/storage/redux'
import { defaultReducerActions } from '../../../constants/storage'

const { RESET_REDUCERS } = defaultReducerActions

export const resetReducers = () => createReduxAction( RESET_REDUCERS )
