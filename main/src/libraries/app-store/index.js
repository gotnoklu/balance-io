import electron from 'electron'
import path from 'path'
import fs from 'fs'
import {
	writeToFile,
	parseFile,
	createDirectory,
	createFileBackup,
	readFileBackup,
	createSuccessResponse,
	createErrorResponse,
	getValueOfKey,
	setValueOfKey,
	createBase64Id,
} from '../../utilities/global'

class AppStore {
	constructor(
		store_name = 'App Store',
		initial_data = null,
		store_config = { extension: '.json' }
	) {
		const defaultStoreConfig = store_config || { extension: '.json' }
		const app = electron.app || electron.remote.app
		const documentsPath = app.getPath( 'documents' )
		const userDataPath = app.getPath( 'userData' )
		const appStoreDirName = 'Balance Store'
		const storeDir = store_name
		const backupDir = storeDir

		this.storeName = store_name
		this.storeConfig = defaultStoreConfig
		this.initialData = initial_data
		this.storeKey = createBase64Id( 32 )
		this.dirs = {
			backupData: path.join( documentsPath, appStoreDirName, backupDir ),
			storeData: path.join( userDataPath, appStoreDirName, storeDir ),
		}
		this.paths = {
			backupData: path.join( this.dirs.backupData, this.storeName + '.backup.gz' ),
			storeData: path.join( this.dirs.storeData, this.storeName + this.storeConfig.extension ),
		}
		this.data = parseFile( this.paths.storeData, {
			...this.initialData,
			_storeInfo: {
				_storeKey: this.storeKey,
				_backup: { _createdAt: null },
			},
		} )

		// Create initial directories for app store
		if ( !fs.existsSync( path.join( documentsPath, appStoreDirName ) ) ) {
			createDirectory( path.join( documentsPath, appStoreDirName ) )
		}
		if ( !fs.existsSync( path.join( userDataPath, appStoreDirName ) ) ) {
			createDirectory( path.join( userDataPath, appStoreDirName ) )
		}

		// Create directories for backups and main store data
		const directoriesResponse = this._createStoreDirectories()
		// Write initial data to store file
		const initialWriteResponse = this._initWriteData()
		// Back store file up if directories are created and initial write succeeds
		if ( directoriesResponse.success && initialWriteResponse.success ) {
			this.backupStore()
		}
	}

	_initWriteData() {
		try {
			if ( !fs.existsSync( `file://${this.paths.storeData}` ) ) {
				const successResponse = { message: 'Initial write to store file succeeded.' }
				writeToFile( this.paths.storeData, this.data )
				return createSuccessResponse( successResponse )
			}
		} catch ( error ) {
			console.log( error )
			return createErrorResponse( { message: 'Could not write initial data to app store file.' } )
		}
	}

	_createStoreDirectories() {
		const errorResponse = createErrorResponse( { message: 'Could not create directories.' } )
		try {
			const dirs = [this.dirs.storeData, this.dirs.backupData]
			const createdDirs = dirs.map( dir => createDirectory( dir ) )
			if ( createdDirs.every( value => value.success === true ) ) {
				const successResponse = {
					message: 'Directories created successfully!',
					data: createdDirs[0].data,
				}
				return createSuccessResponse( successResponse )
			}
			return createErrorResponse( { message: 'Could not create app store directories.' } )
		} catch ( error ) {
			console.log( error )
			return errorResponse
		}
	}

	_getStoreKey() {
		return this.storeKey
	}

	writeToFile( file_name, data, extension = this.storeConfig.extension ) {
		try {
			const path = path.join( this.paths.storeData, file_name + extension )
			if ( !fs.existsSync( `file://${path}` ) ) {
				writeToFile( path, data )
				return createSuccessResponse( { message: 'Write to file succeeded!', data } )
			}
		} catch ( error ) {
			console.log( error )
			return createErrorResponse( { message: 'Could not write to file.' } )
		}
	}

	get( keyPath = '' ) {
		try {
			return createSuccessResponse( {
				message: 'Value gotten successfully.',
				data: getValueOfKey( this.data, keyPath ),
			} )
		} catch ( error ) {
			return createErrorResponse( { message: 'Could not get value.' } )
		}
	}

	set( keyPath = '', value ) {
		try {
			const result = setValueOfKey( this.data, keyPath, value )
			this.data = result
			writeToFile( this.paths.storeData, this.data )
			return createSuccessResponse( { message: 'Value set successfully!', data: this.data } )
		} catch ( error ) {
			return createErrorResponse( { message: 'Could not set value.' } )
		}
	}

	setStore( value ) {
		try {
			this.data = value
			writeToFile( this.paths.storeData, this.data )
			return createSuccessResponse( { message: 'Store value set successfully!', data: this.data } )
		} catch ( error ) {
			return createErrorResponse( { message: 'Could not set store value.' } )
		}
	}

	getAll() {
		try {
			return createSuccessResponse( {
				message: 'All data gotten successfully!',
				data: parseFile( this.paths.storeData ) || this.data,
			} )
		} catch ( error ) {
			return createErrorResponse( { message: 'Could not get app store data.' } )
		}
	}

	delete( key ) {
		try {
			const oldEntries = Object.entries( this.data )
			const newEntries = oldEntries.filter( entry => entry[0] !== key )
			this.data = Object.fromEntries( newEntries )
			writeToFile( this.paths.storeData, this.data )
			return createSuccessResponse( { message: `${key} removed successfully!`, data: this.data } )
		} catch ( error ) {
			return createErrorResponse( `Could not remove ${key} from app store data.` )
		}
	}

	clear() {
		try {
			this.data = {}
			return this.writeToFile( this.paths.storeData, this.data )
		} catch ( error ) {
			return createErrorResponse( { message: 'Could not clear app store data.' } )
		}
	}

	backupStore( createdAt = new Date() ) {
		try {
			createFileBackup( this.paths.storeData, this.paths.backupData )
			this.set( '_storeInfo._backup._createdAt', createdAt )
			return createSuccessResponse( { message: 'Backup created successfully!', data: this.data } )
		} catch ( error ) {
			return createErrorResponse( { message: 'Backup failed.', data: this.data } )
		}
	}

	readFromStoreBackup() {
		try {
			const oldData = this.data
			readFileBackup( this.paths.storeData, this.paths.backupData, oldData )
			return createSuccessResponse( { message: 'Success reading from backup!' } )
		} catch ( error ) {
			return createErrorResponse( { message: 'Reading from backup failed.' } )
		}
	}
}

export default AppStore
