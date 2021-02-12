import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TaskViewPanel from './TaskViewPanel'

const useStyles = makeStyles( {
	taskView: {
		height: '100%',
	},
} )

const TaskView = ( { tasks, onAdd, onCompleted, onEdit, onDelete, onDeleteSelected } ) => {
	const classes = useStyles()
	const tasksIsArray = Array.isArray( tasks )
	const unfinishedTasks = tasksIsArray && tasks.filter( task => !task.completed )
	const completedTasks = tasksIsArray && tasks.filter( task => task.completed )

	return (
		<Grid container spacing={2} justify='center' className={classes.taskView}>
			<Grid item sm={6}>
				<TaskViewPanel
					tasks={unfinishedTasks}
					title='Tasks'
					fallbackText='All done here!'
					onAdd={onAdd}
					onDeleteSelected={onDeleteSelected}
					onEdit={onEdit}
					onCompleted={onCompleted}
					onDelete={onDelete}
					allowAdd
				/>
			</Grid>
			<Grid item sm={6}>
				<TaskViewPanel
					tasks={completedTasks}
					title='Completed'
					fallbackText='No completed tasks.'
					onDeleteSelected={onDeleteSelected}
					onEdit={onEdit}
					onCompleted={onCompleted}
					onDelete={onDelete}
				/>
			</Grid>
		</Grid>
	)
}

TaskView.propTypes = {
	tasks: PropTypes.array.isRequired,
	onAdd: PropTypes.func,
	onCompleted: PropTypes.func.isRequired,
	onDeleteSelected: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
}

export default TaskView
