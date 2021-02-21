const isServer = typeof window === 'undefined'

export const saveState = state => {
	try {
		if ( !isServer ) {
			const serializedState = JSON.stringify( state )
			localStorage.setItem( 'store', serializedState )
		}
	} catch ( error ) {
		return undefined
	}
}

export const loadState = () => {
	try {
		if ( !isServer ) {
			const serializedState = localStorage.getItem( 'store' )
			if ( serializedState === null ) {
				return undefined
			}
			return JSON.parse( serializedState )
		}
	} catch ( error ) {
		// Ignore write errors
	}
}

export const clearState = () => {
	try {
		if ( !isServer ) {
			localStorage.clear()
		}
	} catch ( error ) {
		// Ignore write errors
	}
}
