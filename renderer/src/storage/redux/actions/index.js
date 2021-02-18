import {
	setAppTheme,
	setAppBackupType,
	setAppStore,
	setAppAutoBackupDelay,
	setAppSettings,
	setAppSelectedSetting,
} from './app-actions'

import {
	setTaskStore,
	deleteAllTasks,
	deleteMultipleTasks,
	deleteTask,
	saveTask,
} from './task-actions'

import {
	setBoardStore,
	addBoard,
	removeBoard,
	removeAllBoards,
	setCurrentBoard,
} from './board-actions'

import { setPanelStore, addPanel, removePanel, removeAllPanels } from './panel-actions'

export {
	setAppTheme,
	setAppBackupType,
	setTaskStore,
	deleteAllTasks,
	deleteMultipleTasks,
	deleteTask,
	saveTask,
	setAppStore,
	setAppAutoBackupDelay,
	setBoardStore,
	addBoard,
	removeBoard,
	removeAllBoards,
	setPanelStore,
	addPanel,
	removePanel,
	removeAllPanels,
	setAppSettings,
	setAppSelectedSetting,
	setCurrentBoard,
}
