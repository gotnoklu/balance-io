import { createStore } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import rootReducer from '../reducers'
import { saveState, loadState } from '../../persistence'
import throttle from 'lodash/throttle'

const persistedState = loadState()
const store = createStore(rootReducer, persistedState)

store.subscribe(
	throttle(() => {
		saveState(store.getState())
	}, 1000)
)

const storeWrapper = createWrapper(() => store)

export default storeWrapper
