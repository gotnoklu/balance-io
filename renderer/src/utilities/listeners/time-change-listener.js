class TimeChangeListener {
	constructor() {
		this.id = null
	}

	createOneTimeListener( triggerDate, callback, delay ) {
		try {
			if ( typeof window !== 'undefined' ) {
				const getCurrentDate = () => new Date()
				const convertedDate = triggerDate instanceof Date ? triggerDate : new Date( triggerDate )

				const checkTime = () => {
					const currentDate = getCurrentDate()
					if ( currentDate >= convertedDate ) {
						if ( callback ) callback( this.id )
						this.removeListener()
					}
				}

				this.id = window.setInterval( checkTime, delay )
			}
		} catch ( error ) {
			console.log( error )
		}
	}

	createRepeatingListener( triggerDate, callback, delay ) {
		try {
			if ( typeof window !== 'undefined' ) {
				const getCurrentDate = () => new Date()
				const convertedDate = triggerDate instanceof Date ? triggerDate : new Date( triggerDate )

				const checkTime = () => {
					const currentDate = getCurrentDate()
					if ( currentDate >= convertedDate ) {
						if ( callback ) callback( this.id )
					}
				}

				this.id = window.setInterval( checkTime, delay )
			}
		} catch ( error ) {
			console.log( error )
		}
	}

	removeListener() {
		if ( this.id !== null ) window.clearInterval( this.id )
	}
}

export default TimeChangeListener
