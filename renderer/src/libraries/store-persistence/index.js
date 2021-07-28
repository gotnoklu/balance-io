import { isServer } from '../../constants/app'

export const saveState = ( key, state ) => {
	try {
		if ( !isServer ) {
			const serializedState = JSON.stringify( state )
			localStorage.setItem( key, serializedState )
		}
	} catch ( error ) {
		return undefined
	}
}

export const loadState = key => {
	try {
		if ( !isServer ) {
			const serializedState = localStorage.getItem( key )
			if ( serializedState === null ) {
				return undefined
			}
			return JSON.parse( serializedState )
		}
	} catch ( error ) {
		// Ignore write errors
	}
}

export const deleteState = key => {
	try {
		if ( !isServer ) {
			localStorage.removeItem( key )
		}
	} catch ( error ) {
		// Ignore write errors
	}
}
