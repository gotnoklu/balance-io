const crypto = require( 'crypto' )

export const createCharacterString = length => {
	const characters = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
	]
	let result = []
	while ( result.length < length ) {
		result.push( characters[Math.floor( characters.length * Math.random() )] )
	}
	return result.join( '' )
}

export const createId = length => createCharacterString( length )

export const createBase64Id = length => {
	const pseudoRandomKey = createId( length )
	const hash = crypto.createHash( 'sha256' ).update( pseudoRandomKey ).digest( 'base64' )
	return hash
}

export const createObjectClone = ( ...sources ) => Object.assign( {}, ...sources )

export const findIndexFromArray = ( list, predicate ) => list.findIndex( predicate )

export const getValueOfKey = ( object, keyPath ) => {
	const keys = splitObjectKeys( keyPath )
	let counter = 0
	let current = object
	while ( counter < keys.length ) {
		current = Object.getOwnPropertyDescriptor( current, keys[counter] ).value
		counter += 1
	}
	return current
}

export const splitObjectKeys = ( keyString, delimiter = '.' ) => keyString.split( delimiter )

export const setValueOfKey = ( object, keyPath, value ) => {
	const objectClone = createObjectClone( object )
	const keys = splitObjectKeys( keyPath )
	let counter = 0
	let current = objectClone
	while ( counter < keys.length - 1 ) {
		current = Object.getOwnPropertyDescriptor( current, keys[counter] ).value
		counter += 1
	}
	current[keys[keys.length - 1]] = value
	return objectClone
}

export const createResponse = ( data, success = false, error = false ) => ( { success, data, error } )

export const createErrorResponse = message => createResponse( message, false, true )

export const parseTimeStringFormat = ( accept = { hour: 'h', minute: 'm', second: 's' } ) => {
	return ( timeString = '' ) => {
		const second = 1000
		const minute = 60 * second
		const hour = 60 * minute
		const timeValue = timeString.split( /[a-zA-Z]+/g )[0]
		const timeQuantity = timeString.split( /[0-9]+/g )[1]

		switch ( timeQuantity ) {
			case accept.hour:
				return {
					value: Number( timeValue ) * hour,
					label: `${timeValue} ${timeValue > 1 ? 'hours' : 'hour'}`,
				}
			case accept.minute:
				return {
					value: Number( timeValue ) * minute,
					label: `${timeValue} ${timeValue > 1 ? 'minutes' : 'minute'}`,
				}
			case accept.second:
				return {
					value: Number( timeValue ) * second,
					label: `${timeValue} ${timeValue > 1 ? 'seconds' : 'second'}`,
				}
			default:
				break
		}
	}
}

export const findTimeDifference = ( firstTime, secondTime ) => {
	return firstTime - secondTime
}
