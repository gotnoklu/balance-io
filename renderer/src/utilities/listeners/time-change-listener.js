class TimeChangeListener {
	constructor() {
		this.id = null
	}

	createListener(triggerDate, callback, delay) {
		try {
			if (typeof window !== 'undefined') {
				const getCurrentDate = () => new Date()
				const convertedDate = triggerDate instanceof Date ? triggerDate : new Date(triggerDate)

				const checkTime = () => {
					const currentDate = getCurrentDate()
					if (currentDate >= convertedDate) {
						if (callback) callback(this.id)
						this.removeListener()
					}
				}

				this.id = window.setInterval(checkTime, delay)
			}
		} catch (error) {
			console.log(error)
		}
	}

	removeListener() {
		window.clearInterval(this.id)
	}
}

export default TimeChangeListener
