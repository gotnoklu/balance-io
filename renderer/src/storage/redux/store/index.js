import { createStore } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import rootReducer from '../reducers'
import { saveState, loadState } from '../../../libraries/store-persistence'
import throttle from 'lodash/throttle'
import { persistenceKeys } from '../../../constants/storage'

const { ROOT } = persistenceKeys

const persistedState = loadState( ROOT )
const store = createStore( rootReducer, persistedState )

store.subscribe(
	throttle( () => {
		saveState( ROOT, store.getState() )
	}, 1000 )
)

const storeWrapper = createWrapper( () => store )

export default storeWrapper
