const electron = require('electron')
const path = require('path')
const fs = require('fs')
const {
	writeToFile,
	parseFile,
	createDirectory,
	createFileBackup,
	readFileBackup,
	createResponse,
	createErrorResponse,
	getValueOfKey,
	setValueOfKey,
} = require('../../global')
const packageJsonFile = require('../../../package.json')

class AppStore {
	constructor(options) {
		const defaultOptions = options || {}
		const app = electron.app || electron.remote.app
		const documentsPath = app.getPath('documents')
		const userDataPath = app.getPath('userData')
		const storeDir = defaultOptions.directory || packageJsonFile.name
		const backupDir = defaultOptions.backupDir || storeDir
		this.storeName = defaultOptions.storeName
		this.storeKey = defaultOptions.storeKey || '_store'
		this.dirs = {
			backupData: path.join(documentsPath, backupDir),
			storeData: path.join(userDataPath, storeDir),
		}
		this.paths = {
			backupData: path.join(this.dirs.backupData, this.storeName + '.backup.gz'),
			storeData: path.join(this.dirs.storeData, this.storeName + '.json'),
		}
		this.data = parseFile(this.paths.storeData, {
			...defaultOptions.defaults,
			_storeInfo: {
				_storeKey: this.storeKey,
				_backup: { _createdAt: null },
			},
		})

		this._createStoreDirectories()
		this._initWriteData()
		this.backup()
	}

	_initWriteData() {
		try {
			if (!fs.existsSync(this.paths.storeData)) {
				writeToFile(this.paths.storeData, this.data)
				return createResponse('Initial write to store file succeeded.', true)
			}
		} catch (error) {
			return createErrorResponse('Could not write initial data to app store file.')
		}
	}

	_createStoreDirectories() {
		const errorResponse = createErrorResponse('Could not create directories.')
		try {
			const dirs = [this.dirs.storeData, this.dirs.backupData]
			const createdDirs = dirs.map((dir) => createDirectory(dir))
			if (createdDirs.every((value) => value.success === true)) {
				return createResponse(createdDirs[0].data, true)
			}
			return createErrorResponse('Could not create app store directories.')
		} catch (error) {
			return errorResponse
		}
	}

	get(keyPath = '') {
		try {
			return createResponse(getValueOfKey(this.data, keyPath), true)
		} catch (error) {
			return createErrorResponse('Could not get value.')
		}
	}

	set(keyPath = '', value) {
		try {
			const result = setValueOfKey(this.data, keyPath, value)
			this.data = result
			writeToFile(this.paths.storeData, this.data)
			return createResponse('Value set successfully!', true)
		} catch (error) {
			return createErrorResponse('Could not set value.')
		}
	}

	getAll() {
		try {
			return createResponse(parseFile(this.paths.storeData) || this.data, true)
		} catch (error) {
			return createErrorResponse('Could not get app store data.')
		}
	}

	delete(key) {
		try {
			const oldEntries = Object.entries(this.data)
			const newEntries = oldEntries.filter((entry) => entry[0] !== key)
			this.data = Object.fromEntries(newEntries)
			writeToFile(this.paths.storeData, this.data)
			return createResponse(`${key} removed successfully!`, true)
		} catch (error) {
			return createErrorResponse(`Could not remove ${key} from app store data.`)
		}
	}

	clear() {
		try {
			this.data = {}
			writeToFile(this.paths.storeData, this.data)
		} catch (error) {
			return createErrorResponse('Could not clear app store data.')
		}
	}

	backup(createdAt = new Date()) {
		try {
			createFileBackup(this.paths.storeData, this.paths.backupData)
			this.set('_storeInfo._backup._createdAt', createdAt)
			return createResponse('Backup created successfully!', true)
		} catch (error) {
			return createErrorResponse('Backup failed.')
		}
	}

	readFromBackup() {
		try {
			const oldData = this.data
			readFileBackup(this.paths.storeData, this.paths.backupData, oldData)
			return createResponse('Success reading from backup!', true)
		} catch (error) {
			return createErrorResponse('Reading from backup failed.')
		}
	}
}

module.exports = AppStore
