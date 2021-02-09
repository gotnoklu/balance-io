import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Drawer, TaskView, TaskDialog, DeleteDialog } from '../components'
import {
	saveToMainAppStore,
	backupMainAppStore,
	getMainAppStore,
} from '../utilities/store/electron-renderer'
import { showAppNotification } from '../utilities/notifications'
import { useDispatch, useSelector } from 'react-redux'
import { getTasksStore, getAppTheme, getAppBackupType } from '../utilities/store/redux/selectors'
import { setTasksStore, setAppStoreBackupType } from '../utilities/store/redux/actions'
import { createId, findIndexFromArray } from '../utilities/global'
import { drawerWidth, mainAppStoreKeys } from '../constants'
import clsx from 'clsx'
import Toolbar from '@material-ui/core/Toolbar'
import TimeChangeListener from '../utilities/listeners/time-change-listener'

function HomePage({ setAppTheme }) {
	const [tasks, setTasks] = React.useState([])
	const [drawerOpen, setDrawerOpen] = React.useState(false)
	const [selected, setSelected] = React.useState([])
	const [taskDialogOpen, setTaskDialogOpen] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [taskDialogTitle, setTaskDialogTitle] = React.useState('Create Task')
	const [selectedDetails, setSelectedDetails] = React.useState(null)

	const classes = useStyles()
	const dispatch = useDispatch()

	const appTheme = useSelector(getAppTheme)
	const appBackupType = useSelector(getAppBackupType)
	const allTasks = useSelector(getTasksStore)

	const setAppBackupType = async (type) => {
		dispatch(setAppStoreBackupType(type))
		await saveToMainAppStore(mainAppStoreKeys.BACKUP_TYPE, type)
	}

	const setAppTasksStore = (value) => dispatch(setTasksStore(value))

	React.useEffect(() => {
		const handleSetAppTasksStore = async () => {
			const response = await getMainAppStore()
			if (response.success) {
				setAppTasksStore(response.data.tasks)
			}
		}
		handleSetAppTasksStore()
	}, [])

	React.useEffect(() => {
		if (allTasks) setTasks(allTasks)
		return () => {
			setTasks([])
		}
	}, [allTasks])

	const handleToggleDrawer = () => setDrawerOpen(!drawerOpen)

	const handleOpenTaskDialog = () => setTaskDialogOpen(true)

	const handleOpenEditDialog = (details) => {
		setTaskDialogTitle('Edit Task')
		setSelectedDetails(details)
		handleOpenTaskDialog()
	}

	const handleCloseTaskDialog = () => setTaskDialogOpen(false)

	const handleCloseDeleteDialog = () => setDeleteDialogOpen(false)

	const handleSaveTask = async (title, description, reminder, completed) => {
		const newTaskId = createId(20)
		const newTask = { id: newTaskId, title, description, reminder, completed }
		const mainAppStore = await getMainAppStore()
		const mainAppStoreTasks = await mainAppStore.data.tasks.concat(newTask)

		setTasks(tasks.concat(newTask))
		await saveToMainAppStore(mainAppStoreKeys.TASKS, mainAppStoreTasks)

		if (reminder && !reminder.expired) {
			const lastNotificationListener = new TimeChangeListener()

			const handleFirstNotification = () => {
				showAppNotification(title, description, `Task is due in ${reminder.notifyBefore.label}.`)
			}
			const handleLastNotification = async () => {
				const copiedTasks = [...tasks]
				copiedTasks[
					findIndexFromArray(copiedTasks, ({ id }) => id === newTaskId)
				].reminder.expired = true
				setTasks(copiedTasks)
				await showAppNotification(title, description, 'Task is due now.')
				await saveToMainAppStore(mainAppStoreKeys.TASKS, mainAppStoreTasks)
			}

			if (reminder.notifyBefore.value !== 0) {
				const firstNotificationListener = new TimeChangeListener()
				firstNotificationListener.createListener(
					reminder.expiresAt - reminder.notifyBefore.value,
					handleFirstNotification,
					500
				)
			}

			lastNotificationListener.createListener(reminder.expiresAt, handleLastNotification, 500)
		}
		handleCloseTaskDialog()
	}

	const handleEditTask = (id, updatedDetails) => {}

	const handleDeleteTask = (id) => {}

	const handleDeleteSelected = () => {}

	const handleCompleteTask = (id) => {}

	const handleSelectTask = (id) => {}

	return (
		<div className={classes.root}>
			<TaskDialog
				title={taskDialogTitle}
				open={taskDialogOpen}
				onClose={handleCloseTaskDialog}
				onEdit={handleEditTask}
				onSave={handleSaveTask}
				editDetails={selectedDetails}
			/>
			<DeleteDialog
				selected={tasks.length}
				open={deleteDialogOpen}
				onClose={handleCloseDeleteDialog}
				onDelete={handleDeleteSelected}
			/>
			<Drawer
				open={drawerOpen}
				appTheme={appTheme}
				backupType={appBackupType}
				onThemeChange={setAppTheme}
				onBackupTypeChange={setAppBackupType}
				onBackup={backupMainAppStore}
			/>
			<AppBar drawerOpen={drawerOpen} onDrawerToggle={handleToggleDrawer} />
			<main
				className={clsx(classes.content, {
					[classes.contentShift]: drawerOpen,
				})}
			>
				<Toolbar />
				<TaskView
					tasks={tasks}
					onAdd={handleOpenTaskDialog}
					onComplete={handleCompleteTask}
					onEdit={handleOpenEditDialog}
					onDelete={handleDeleteTask}
					onSelect={handleSelectTask}
				/>
			</main>
		</div>
	)
}

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		width: '100%',
		height: '100vh',
		overflow: 'hidden',
	},
	content: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
}))

HomePage.propTypes = {
	setAppTheme: PropTypes.func,
}

export default HomePage
