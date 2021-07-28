import { findTimeDifference } from '../../utilities/global'

class DurationListener {
	constructor() {
		this.oneTimeId = null
		this.repeatingId = null
	}

	createOneTimeListener( triggerDate, callback ) {
		try {
			if ( typeof window !== 'undefined' ) {
				const convertedDate = triggerDate instanceof Date ? triggerDate : new Date( triggerDate )
				const currentDate = new Date()
				const runCallback = () => {
					if ( callback ) callback()
					return this.removeOneTimeListener( this.oneTimeId )
				}
				const delay = findTimeDifference( convertedDate, currentDate )
				if ( delay > 0 ) {
					this.oneTimeId = window.setTimeout( runCallback, delay )
				}
			}
		} catch ( error ) {
			console.log( error )
		}
	}

	createRepeatingListener( triggerDate, callback ) {
		try {
			if ( typeof window !== 'undefined' ) {
				const convertedDate = triggerDate instanceof Date ? triggerDate : new Date( triggerDate )
				const currentDate = new Date()
				const runCallback = () => {
					if ( callback ) callback()
				}
				const delay = findTimeDifference( convertedDate, currentDate )
				if ( delay > 0 ) {
					this.id = window.setInterval( runCallback, delay )
				}
			}
		} catch ( error ) {
			console.log( error )
		}
	}

	removeOneTimeListener() {
		if ( this.oneTimeId !== null ) window.clearTimeout( this.oneTimeId )
	}

	removeRepeatingListener() {
		if ( this.repeatingId !== null ) window.clearInterval( this.repeatingId )
	}
}

export default DurationListener
