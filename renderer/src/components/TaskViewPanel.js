import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
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
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
	taskViewPanel: {
		position: 'relative',
		height: '100%',
		overflow: 'hidden',
		backgroundColor: theme.palette.primary.main,
	},
	taskViewPanelContent: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		wdith: '100%',
		overflow: 'hidden',
		overflowY: 'auto',
		paddingBottom: theme.spacing(1),
	},
	taskViewPanelTitleBox: {
		borderRadius: '4px 4px 0px 0px',
		backgroundColor: theme.palette.primary.main,
		boxShadow: theme.shadows[2],
	},
	taskViewPanelTitle: {
		width: '100%',
		transition: theme.transitions.create(['width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	taskViewPanelTitleShift: {
		width: '0%',
		transition: theme.transitions.create(['width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	taskViewPanelTitleText: {
		marginLeft: theme.spacing(1),
	},
}))

const TaskViewPanel = ({
	title,
	tasks,
	fallbackText,
	fallbackTextProps,
	onAdd,
	onDeleteSelected,
	onCompleted,
	onEdit,
	onDelete,
	allowAdd,
}) => {
	const [selectedTasks, setSelectedTasks] = React.useState([])
	const [deleteBarIsOpen, setDeleteBarIsOpen] = React.useState(false)
	const [allSelected, setAllSelected] = React.useState(false)

	const classes = useStyles()

	const handleSetSelected = (taskId, isSelected) => {
		switch (isSelected) {
			case false:
				return setSelectedTasks(selectedTasks.concat(taskId))
			case true:
				return setSelectedTasks(selectedTasks.filter((selected) => selected !== taskId))
			default:
				break
		}
	}

	const handleDeleteBarToggle = () => {
		if (deleteBarIsOpen) {
			setSelectedTasks([])
			setAllSelected(false)
		}
		setDeleteBarIsOpen(!deleteBarIsOpen)
	}

	const toggleSelectAll = () => {
		if (allSelected) {
			setSelectedTasks([])
		} else {
			setSelectedTasks(tasks.map((task) => task.id))
		}
		setAllSelected(!allSelected)
	}

	const handleDeleteSelected = () => {
		if (onDeleteSelected) onDeleteSelected(selectedTasks)
	}

	React.useEffect(() => {
		if (!selectedTasks.length) setAllSelected(false)
	}, [selectedTasks])

	return (
		<Paper className={classes.taskViewPanel}>
			<Box
				width='100%'
				zIndex={4}
				position='absolute'
				top={0}
				left={0}
				className={classes.taskViewPanelTitleBox}
			>
				<Box padding={1} display='flex' width='100%' zIndex={4}>
					<Box
						overflow='hidden'
						width='inherit'
						display='flex'
						flexGrow={1}
						alignItems='center'
						justifySelf='flex-start'
					>
						<Box
							className={clsx(classes.taskViewPanelTitle, {
								[classes.taskViewPanelTitleShift]: deleteBarIsOpen,
							})}
							height='inherit'
							display='flex'
							alignItems='center'
							overflow='hidden'
						>
							{allowAdd && (
								<IconButton color='secondary' onClick={onAdd}>
									<AddIcon />
								</IconButton>
							)}
							<Typography variant='h5' component='h3' className={classes.taskViewPanelTitleText}>
								{title}
							</Typography>
						</Box>
						<EffectBox
							open={deleteBarIsOpen}
							effect='slide'
							direction='left'
							height='inherit'
							mountOnEnter
						>
							<DeleteBar
								selected={allSelected && selectedTasks.length === tasks.length}
								numberSelected={selectedTasks.length}
								selectionDisabled={!tasks.length}
								onSelect={toggleSelectAll}
								onDeleteSelected={handleDeleteSelected}
							/>
						</EffectBox>
					</Box>
					<IconButton onClick={handleDeleteBarToggle}>
						{!deleteBarIsOpen ? (
							<DeleteIcon color='secondary' />
						) : (
							<ArrowRightIcon color='secondary' />
						)}
					</IconButton>
				</Box>
			</Box>
			{tasks.length ? (
				<Box
					paddingTop={2}
					paddingLeft={1}
					paddingRight={1}
					paddingBottom={1}
					className={classes.taskViewPanelContent}
				>
					<Toolbar />
					<Grid container spacing={2}>
						{tasks.map(({ id, title, description, reminder, completed }) => (
							<Grid key={id} item xs={12} md={6}>
								<TaskCard
									id={id}
									title={title}
									description={description}
									reminder={reminder}
									onCompleted={onCompleted}
									completed={completed}
									onEdit={onEdit}
									onSelect={handleSetSelected}
									selectionStarted={deleteBarIsOpen}
									selected={allSelected}
									onDelete={onDelete}
								/>
							</Grid>
						))}
					</Grid>
				</Box>
			) : (
				<Box
					position='absolute'
					top={0}
					left={0}
					display='flex'
					alignItems='center'
					justifyContent='center'
					width='100%'
					height='100%'
				>
					<FallbackText text={fallbackText} height='100%' {...fallbackTextProps} />
				</Box>
			)}
		</Paper>
	)
}

TaskViewPanel.propTypes = {
	title: PropTypes.string.isRequired,
	tasks: PropTypes.array.isRequired,
	fallbackText: PropTypes.string.isRequired,
	fallbackTextProps: PropTypes.object,
	onAdd: PropTypes.func,
	onCompleted: PropTypes.func.isRequired,
	onSelect: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	onDeleteSelected: PropTypes.func,
	allowAdd: PropTypes.bool,
}

export default TaskViewPanel
