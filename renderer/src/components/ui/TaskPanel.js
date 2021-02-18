import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TaskCard from './TaskCard'
import DeleteIcon from '@material-ui/icons/DeleteSweep'
import ArrowRightIcon from '@material-ui/icons/ChevronRight'
import AddIcon from '@material-ui/icons/Add'
import EffectBox from './EffectBox'
import DeleteBar from './DeleteBar'
import FallbackText from './FallbackText'
import TaskDialog from './TaskDialog'
import DeleteDialog from './DeleteDialog'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { getTasksByPanel, getTasksStore } from '../../storage/redux/selectors'
import TimeChangeListener from '../../utilities/listeners/time-change-listener'
import { showAppNotification } from '../../utilities/notifications'
import { createId, findIndexFromArray } from '../../utilities/global'
import { saveToMainAppStore } from '../../storage/electron-renderer'
import { storageKeys } from '../../constants'
import { setTaskStore } from '../../storage/redux/actions'
import Task from '../../models/Task'

const useStyles = makeStyles( theme => ( {
	taskPanel: {
		position: 'relative',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		background: 'none',
	},
	taskPanelContent: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		overflowY: 'auto',
		paddingBottom: theme.spacing( 1 ),
	},
	taskPanelTitleBox: {
		borderRadius: '4px 4px 0px 0px',
		backgroundColor: theme.palette.primary.dark,
	},
	taskPanelTitle: {
		width: '100%',
		transition: theme.transitions.create( ['width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		} ),
	},
	taskPanelTitleShift: {
		width: '0%',
		transition: theme.transitions.create( ['width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		} ),
	},
	taskPanelTitleText: {
		marginLeft: theme.spacing( 1 ),
	},
} ) )

const TaskPanel = ( { id, name, allowAdd, allowDelete } ) => {
	const [selectedTasks, setSelectedTasks] = React.useState( [] )
	const [deleteBarIsOpen, setDeleteBarIsOpen] = React.useState( false )
	const [allSelected, setAllSelected] = React.useState( false )
	const [taskDialogOpen, setTaskDialogOpen] = React.useState( false )
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState( false )
	const [taskDialogTitle, setTaskDialogTitle] = React.useState( 'Create Task' )
	const [selectedDetails, setSelectedDetails] = React.useState( null )
	const [areListenersSet, setAreListenersSet] = React.useState( false )

	const classes = useStyles()
	const dispatch = useDispatch()

	const { tasks } = useSelector( getTasksStore )
	const panelTasks = useSelector( getTasksByPanel( id ) )

	const setTasks = async taskList => {
		await dispatch( setTaskStore( taskList ) )
		await saveToMainAppStore( storageKeys.TASKS, taskList )
		return taskList
	}

	const handleSetSelected = ( taskId, isSelected ) => {
		switch ( isSelected ) {
			case false:
				return setSelectedTasks( selectedTasks.concat( taskId ) )
			case true:
				return setSelectedTasks( selectedTasks.filter( selected => selected !== taskId ) )
			default:
				break
		}
	}

	const handleDeleteBarToggle = () => {
		if ( deleteBarIsOpen ) {
			setSelectedTasks( [] )
			setAllSelected( false )
		}
		setDeleteBarIsOpen( !deleteBarIsOpen )
	}

	const toggleSelectAll = () => {
		if ( allSelected ) {
			setSelectedTasks( [] )
		} else {
			setSelectedTasks( panelTasks.map( task => task.id ) )
		}
		setAllSelected( !allSelected )
	}

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

	const handleOpenDeleteDialog = () => setDeleteDialogOpen( true )

	const handleCloseDeleteDialog = () => setDeleteDialogOpen( false )

	const handleShowNotification = ( time, title, description, message, handler ) => {
		const listener = new TimeChangeListener()
		return listener.createOneTimeListener( time, async () => {
			if ( handler ) await handler()
			await showAppNotification( title, description, message )
		} )
	}

	const handleCreateReminder = async ( taskObject, taskList ) => {
		const handleLastNotification = async () => {
			const copiedTasks = [...taskList]
			const updatedTaskIndex = findIndexFromArray( copiedTasks, task => task.id === taskObject.id )
			copiedTasks[updatedTaskIndex].reminder.expired = true
			return await setTasks( copiedTasks )
		}

		const showFirstNotification = async () => {
			const firstTime = taskObject.reminder.expiresAt
			const secondTime = taskObject.reminder.notifyBefore.value
			return await handleShowNotification(
				firstTime - secondTime,
				taskObject.name,
				taskObject.description,
				`Task is due in ${taskObject.reminder.notifyBefore.label}.`
			)
		}

		const showLastNotification = async () => {
			const expires = taskObject.reminder.expiresAt
			return await handleShowNotification(
				expires,
				taskObject.name,
				taskObject.description,
				'Task is due now.',
				handleLastNotification
			)
		}

		if ( taskObject.reminder.notifyBefore.value !== 0 ) await showFirstNotification()
		await showLastNotification()

		if ( !areListenersSet ) return await setAreListenersSet( true )
		return
	}

	const handleAddTask = async details => {
		const taskId = details.id ? details.id : await createId( 20 )
		const taskObject = await new Task(
			details.panel ? details.panel : id,
			taskId,
			details.name,
			details.description,
			details.reminder
		)

		const updatedTasks = await setTasks( tasks.concat( taskObject ) )
		if ( taskObject.reminder && !taskObject.reminder.expired ) {
			await handleCreateReminder( taskObject, updatedTasks )
		}

		return handleCloseTaskDialog()
	}

	const handleEditTask = async updatedDetails => {
		const updatedTasks = await setTasks(
			tasks.map( task => ( task.id === updatedDetails.id ? { ...task, ...updatedDetails } : task ) )
		)
		if ( updatedDetails.reminder ) await handleCreateReminder( updatedDetails, updatedTasks )
		return handleCloseTaskDialog()
	}

	const handleDeleteTask = async id => {
		const copiedTasks = [...tasks]
		copiedTasks.splice(
			findIndexFromArray( copiedTasks, task => task.id === id ),
			1
		)

		return setTasks( copiedTasks )
	}

	const handleDeleteSelected = async () => {
		const copiedTasks = [...tasks]
		selectedTasks.forEach( selected => {
			copiedTasks.splice(
				findIndexFromArray( copiedTasks, task => task.id === selected ),
				1
			)
		} )

		await setTasks( copiedTasks )
		handleDeleteBarToggle()
		return handleCloseDeleteDialog()
	}

	const handlePanelChange = ( panelId, taskId ) => {
		return setTasks( tasks.map( task => ( task.id === taskId ? { ...task, panel: panelId } : task ) ) )
	}

	React.useEffect( () => {
		if ( !areListenersSet ) {
			panelTasks.forEach( async ( task, index ) => {
				if ( task.reminder && !task.reminder.expired ) {
					await handleCreateReminder( panelTasks, index, task )
				}
			} )
		}
	}, [] )

	React.useEffect( () => {
		if ( !selectedTasks.length ) setAllSelected( false )
	}, [selectedTasks] )

	return (
		<Paper variant='outlined' className={classes.taskPanel}>
			<TaskDialog
				title={taskDialogTitle}
				open={taskDialogOpen}
				onClose={handleCloseTaskDialog}
				onEdit={handleEditTask}
				onSave={handleAddTask}
				editDetails={selectedDetails}
			/>
			<DeleteDialog
				selected={selectedTasks.length}
				open={deleteDialogOpen}
				onClose={handleCloseDeleteDialog}
				onDelete={handleDeleteSelected}
			/>
			<Box
				width='100%'
				height={!allowAdd && !allowDelete ? '64px' : 'max-content'}
				zIndex={4}
				position='absolute'
				top={0}
				left={0}
				className={classes.taskPanelTitleBox}>
				<Box padding={1} display='flex' width='100%' height='100%' zIndex={6}>
					<Box
						overflow='hidden'
						width='inherit'
						display='flex'
						flexGrow={1}
						alignItems='center'
						justifySelf='flex-start'>
						<Box
							className={clsx( classes.taskPanelTitle, {
								[classes.taskPanelTitleShift]: deleteBarIsOpen,
							} )}
							height='inherit'
							display='flex'
							alignItems='center'
							overflow='hidden'>
							{allowAdd && (
								<IconButton color='secondary' onClick={handleOpenTaskDialog}>
									<AddIcon />
								</IconButton>
							)}
							<Typography variant='h5' component='h3' className={classes.taskPanelTitleText}>
								{name}
							</Typography>
						</Box>
						<EffectBox
							open={deleteBarIsOpen}
							effect='slide'
							direction='left'
							height='inherit'
							mountOnEnter>
							<DeleteBar
								selected={allSelected && selectedTasks.length === panelTasks.length}
								numberSelected={selectedTasks.length}
								selectionDisabled={!panelTasks.length}
								onSelect={toggleSelectAll}
								onDeleteSelected={handleOpenDeleteDialog}
							/>
						</EffectBox>
					</Box>
					{allowDelete && (
						<IconButton onClick={handleDeleteBarToggle}>
							{!deleteBarIsOpen ? (
								<DeleteIcon color='secondary' />
							) : (
								<ArrowRightIcon color='secondary' />
							)}
						</IconButton>
					)}
				</Box>
				<Divider />
			</Box>
			{panelTasks.length ? (
				<React.Fragment>
					<Box
						paddingTop={2}
						paddingLeft={1}
						paddingRight={1}
						paddingBottom={1}
						className={classes.taskPanelContent}>
						<Toolbar />
						<div>
							<Grid container spacing={2}>
								{Array.isArray( panelTasks ) &&
									panelTasks.map( ( { id, name, description, reminder, panel } ) => (
										<Grid key={id} item xs={12}>
											<TaskCard
												id={id}
												name={name}
												description={description}
												reminder={reminder}
												panel={panel}
												onPanelChange={handlePanelChange}
												onEdit={handleOpenEditDialog}
												onSelect={handleSetSelected}
												selectionStarted={deleteBarIsOpen}
												selected={allSelected}
												onDelete={handleDeleteTask}
											/>
										</Grid>
									) )}
							</Grid>
						</div>
					</Box>
				</React.Fragment>
			) : (
				<Box
					position='absolute'
					top={0}
					left={0}
					display='flex'
					alignItems='center'
					justifyContent='center'
					width='100%'
					height='100%'>
					<FallbackText
						text={allowAdd ? 'Click the "+" icon to add a new task' : 'Nothing to do here'}
						height='100%'
					/>
				</Box>
			)}
		</Paper>
	)
}

TaskPanel.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	allowAdd: PropTypes.bool,
	allowDelete: PropTypes.bool,
}

export default TaskPanel
