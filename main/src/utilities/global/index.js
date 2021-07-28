const crypto = require( 'crypto' )
const fs = require( 'fs' )
const zlib = require( 'zlib' )

export const createCharacterString = length => {
	const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345678'
	let result = ''
	while ( result.length < length ) {
		result += characters[Math.floor( characters.length * Math.random() )]
	}
	return result
}

export const createId = length => createCharacterString( length )

export const createBase64Id = charLength => {
	const pseudoRandomKey = createId( charLength )
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

export const createResponse = (
	response = { message: null, data: null },
	success = false,
	error = false
) => {
	const defaultResponse = {
		message: response.message !== undefined ? response.message : null,
		data: response.data !== undefined ? response.data : null,
	}
	return { success, response: defaultResponse, error }
}

export const createSuccessResponse = response => createResponse( response, true, false )

export const createErrorResponse = response => createResponse( response, false, true )

export const createNotificationBody = ( title, subtitle, message, icon, urgency, timeoutType ) => ( {
	title,
	subtitle,
	body: message,
	icon,
	timeoutType,
	urgency,
} )

export const writeToFile = ( path, data ) => {
	try {
		fs.writeFileSync( path, JSON.stringify( data ) )
	} catch ( error ) {
		fs.appendFileSync( path, JSON.stringify( data ) )
	}
}

export const createDirectory = dirPath => {
	if ( !fs.existsSync( dirPath ) ) {
		try {
			fs.mkdirSync( dirPath )
			return createResponse( 'Directory created.', true )
		} catch ( error ) {
			return fs.mkdir( dirPath, err => {
				if ( err ) return false
			} )
		}
	}
	return createResponse( 'Directories exist.', true )
}

export const parseFile = ( filePath, defaults ) => {
	try {
		return JSON.parse( fs.readFileSync( filePath ) )
	} catch ( error ) {
		return defaults
	}
}

export const createFileBackup = ( filePath, backupPath ) => {
	try {
		if ( fs.existsSync( filePath ) ) {
			const gzip = zlib.createGzip()
			const storeData = fs.createReadStream( filePath )
			const compressedData = fs.createWriteStream( backupPath, { autoClose: true } )
			storeData.pipe( gzip ).pipe( compressedData )
			return true
		}
		return false
	} catch ( error ) {
		return false
	}
}

export const readFileBackup = ( filePath, backupPath, fallbackData ) => {
	try {
		if ( fs.existsSync( backupPath ) ) {
			const unzip = zlib.createUnzip()
			const compressedData = fs.createReadStream( backupPath )
			const storeData = fs.createWriteStream( filePath )
			compressedData.pipe( unzip ).pipe( storeData )
			return parseFile( filePath, fallbackData )
		}
		return false
	} catch ( error ) {
		return fallbackData
	}
}
