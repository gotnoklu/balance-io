const isServer = typeof window === 'undefined'

const saveState = (state) => {
	try {
		if (!isServer) {
			const serializedState = JSON.stringify(state)
			localStorage.setItem('store', serializedState)
		}
	} catch (error) {
		return undefined
	}
}

const loadState = () => {
	try {
		if (!isServer) {
			const serializedState = localStorage.getItem('store')
			if (serializedState === null) {
				return undefined
			}
			return JSON.parse(serializedState)
		}
	} catch (error) {
		// Ignore write errors
	}
}

export { saveState, loadState }
