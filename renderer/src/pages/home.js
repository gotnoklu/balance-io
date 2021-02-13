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
import {
	getAppTheme,
	getAppBackupType,
	getAppBackupDelay,
} from '../utilities/store/redux/selectors'
import {
	setTasksStore,
	setAppStoreBackupType,
	setAppStoreBackupDelay,
} from '../utilities/store/redux/actions'
import { createId, findIndexFromArray } from '../utilities/global'
import { drawerWidth, mainAppStoreKeys } from '../constants'
import clsx from 'clsx'
import Toolbar from '@material-ui/core/Toolbar'
import TimeChangeListener from '../utilities/listeners/time-change-listener'
import { useStateWithUpdate } from '../utilities/app-state'

function HomePage( { setAppTheme } ) {
	// Component state
	const [tasks, setTasks] = useStateWithUpdate( [] )
	const [drawerOpen, setDrawerOpen] = React.useState( false )
	const [taskDialogOpen, setTaskDialogOpen] = React.useState( false )
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState( false )
	const [taskDialogTitle, setTaskDialogTitle] = React.useState( 'Create Task' )
	const [selectedDetails, setSelectedDetails] = React.useState( null )
	const [tasksSelected, setTasksSelected] = React.useState( [] )
	const [isListenersSet, setIsListenersSet] = React.useState( false )
	const [isAutoDelaySet, setIsAutoDelaySet] = React.useState( false )

	const classes = useStyles()
	const dispatch = useDispatch()

	const appTheme = useSelector( getAppTheme )
	const appBackupType = useSelector( getAppBackupType )
	const appBackupDelay = useSelector( getAppBackupDelay )

	const setAppAutoBackupDelay = async value => {
		dispatch( setAppStoreBackupDelay( value ) )
		await saveToMainAppStore( mainAppStoreKeys.AUTO_BACKUP_DELAY, value )
	}

	const setAppBackupType = async ( type, delay ) => {
		dispatch( setAppStoreBackupType( type ) )
		await setAppAutoBackupDelay( delay )
		await saveToMainAppStore( mainAppStoreKeys.BACKUP_TYPE, type )
	}

	const setAppTasksStore = value => dispatch( setTasksStore( value ) )

	React.useEffect( () => {
		const handleSetState = async () => {
			const response = await getMainAppStore()
			if ( response.success ) {
				await setTasks( response.data.tasks )
				await dispatch( setAppStoreBackupType( response.data.app.backupType ) )
				await dispatch( setAppStoreBackupDelay( response.data.app.autoBackupDelay ) )
			}
		}

		handleSetState()

		const handleSetAutoBackupListener = () => {
			if ( !isAutoDelaySet && appBackupDelay !== null ) {
				const timeListener = new TimeChangeListener()
				timeListener.removeRepeatingListener( timeListener.id )
				if ( appBackupDelay ) {
					timeListener.createRepeatingListener( appBackupDelay, async () => {
						await backupMainAppStore()
					} )
				}
			}
		}

		handleSetAutoBackupListener()

		return () => {
			setTasks( [] )
		}
	}, [] )

	React.useEffect( () => {
		setAppTasksStore( tasks )

		if ( !isListenersSet ) {
			tasks.forEach( async ( task, index ) => {
				if ( task.reminder && !task.reminder.expired ) {
					const lastListener = new TimeChangeListener()

					const handleFirstNotification = async () => {
						await showAppNotification(
							task.title,
							task.description,
							`Task is due in ${task.reminder.notifyBefore.label}.`
						)
					}

					const handleLastNotification = async () => {
						const copiedTasks = await [...tasks]
						copiedTasks[index].reminder.expired = true
						await showAppNotification( task.title, task.description, 'Task is due now.' )
						await saveToMainAppStore( mainAppStoreKeys.TASKS, await setTasks( copiedTasks ) )
					}

					if ( task.reminder.notifyBefore.value !== 0 ) {
						const firstListener = new TimeChangeListener()
						await firstListener.createOneTimeListener(
							task.reminder.expiresAt - task.reminder.notifyBefore.value,
							handleFirstNotification
						)
					}

					await lastListener.createOneTimeListener( task.reminder.expiresAt, handleLastNotification )

					if ( !isListenersSet ) await setIsListenersSet( true )
				}
			} )
		}

		return () => {
			setAppTasksStore( [] )
		}
	}, [tasks] )

	const handleToggleDrawer = () => setDrawerOpen( !drawerOpen )

	const handleOpenTaskDialog = () => setTaskDialogOpen( true )

	const handleOpenEditDialog = details => {
		setTaskDialogTitle( 'Edit Task' )
		setSelectedDetails( details )
		handleOpenTaskDialog()
	}

	const handleCloseTaskDialog = () => {
		setTaskDialogTitle( 'Create Task' )
		setSelectedDetails( null )
		setTaskDialogOpen( false )
	}

	const handleOpenDeleteDialog = selected => {
		setTasksSelected( selected )
		setDeleteDialogOpen( true )
	}

	const handleCloseDeleteDialog = () => setDeleteDialogOpen( false )

	const handleSaveTask = async ( details, index ) => {
		const setUpdatedTasks = async id => {
			const taskObject = { ...details, id: id }
			if ( index !== undefined ) {
				const copied = [...tasks]
				copied[index] = taskObject
				return await setTasks( copied )
			}

			return await setTasks( tasks.concat( taskObject ) )
		}

		const taskId = details.id ? details.id : await createId( 20 )
		const updatedTasksState = await setUpdatedTasks( taskId )

		await saveToMainAppStore( mainAppStoreKeys.TASKS, updatedTasksState )

		if ( details.reminder && !details.reminder.expired ) {
			const lastNotificationListener = new TimeChangeListener()

			const handleFirstNotification = () => {
				showAppNotification(
					details.title,
					details.description,
					`Task is due in ${details.reminder.notifyBefore.label}.`
				)
			}
			const handleLastNotification = async () => {
				const copiedTasks = await [...updatedTasksState]
				copiedTasks[
					findIndexFromArray( copiedTasks, ( { id } ) => id === taskId )
				].reminder.expired = true
				await showAppNotification( details.title, details.description, 'Task is due now.' )
				await saveToMainAppStore( mainAppStoreKeys.TASKS, await setTasks( copiedTasks ) )
			}

			if ( details.reminder.notifyBefore.value !== 0 ) {
				const firstNotificationListener = new TimeChangeListener()
				firstNotificationListener.createOneTimeListener(
					details.reminder.expiresAt - details.reminder.notifyBefore.value,
					handleFirstNotification
				)
			}

			await lastNotificationListener.createOneTimeListener(
				details.reminder.expiresAt,
				handleLastNotification
			)

			if ( !isListenersSet ) setIsListenersSet( true )
		}

		return handleCloseTaskDialog()
	}

	const handleEditTask = async updatedDetails => {
		const updatedTaskIndex = findIndexFromArray( tasks, ( { id } ) => id === updatedDetails.id )
		return await handleSaveTask( updatedDetails, updatedTaskIndex )
	}

	const handleDeleteTask = async id => {
		const copiedTasks = [...tasks]
		copiedTasks.splice(
			findIndexFromArray( tasks, task => task.id === id ),
			1
		)
		const updatedTasks = await setTasks( copiedTasks )
		await saveToMainAppStore( mainAppStoreKeys.TASKS, updatedTasks )
	}

	const handleDeleteSelected = async () => {
		const copiedTasks = [...tasks]
		await tasksSelected.forEach( task => {
			copiedTasks.splice(
				findIndexFromArray( copiedTasks, ( { id } ) => task === id ),
				1
			)
		} )
		const updatedTasks = await setTasks( copiedTasks )
		await saveToMainAppStore( mainAppStoreKeys.TASKS, updatedTasks )
		handleCloseDeleteDialog()
	}

	const handleCompleteTask = async ( id, completed ) => {
		const updatedTasks = await setTasks(
			tasks.map( task => {
				if ( task.id === id ) return { ...task, completed }
				return task
			} )
		)
		await saveToMainAppStore( mainAppStoreKeys.TASKS, updatedTasks )
	}

	const handleSetAutoBackupListener = async delay => {
		const timeListener = new TimeChangeListener()
		timeListener.removeRepeatingListener( timeListener.id )

		if ( appBackupDelay && delay && delay.value !== appBackupDelay.value ) {
			timeListener.createRepeatingListener( delay.value, async () => {
				await backupMainAppStore()
			} )
		}
		await dispatch( setAppStoreBackupDelay( delay ) )
		await saveToMainAppStore( mainAppStoreKeys.AUTO_BACKUP_DELAY, delay )
		await setIsAutoDelaySet( true )
	}

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
				selected={tasksSelected.length}
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
				onAutoBackupTimeChange={handleSetAutoBackupListener}
				appBackupDelay={appBackupDelay}
			/>
			<AppBar drawerOpen={drawerOpen} onDrawerToggle={handleToggleDrawer} />
			<main
				className={clsx( classes.content, {
					[classes.contentShift]: drawerOpen,
				} )}>
				<Toolbar />
				<TaskView
					tasks={tasks}
					onAdd={handleOpenTaskDialog}
					onCompleted={handleCompleteTask}
					onEdit={handleOpenEditDialog}
					onDelete={handleDeleteTask}
					onDeleteSelected={handleOpenDeleteDialog}
				/>
			</main>
		</div>
	)
}

const useStyles = makeStyles( theme => ( {
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
		padding: theme.spacing( 3 ),
		transition: theme.transitions.create( 'margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		} ),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create( 'margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		} ),
		marginLeft: 0,
	},
} ) )

HomePage.propTypes = {
	setAppTheme: PropTypes.func,
}

export default HomePage
