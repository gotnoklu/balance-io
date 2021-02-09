import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TaskViewPanel from './TaskViewPanel'

const useStyles = makeStyles({
	taskView: {
		height: '100%',
	},
})

const TaskView = ({ tasks, onAdd, onComplete, onSelect, onEdit, onDelete }) => {
	const classes = useStyles()
	const unfinishedTasks = Array.isArray(tasks) && tasks.filter((task) => !task.completed)
	const completedTasks = Array.isArray(tasks) && tasks.filter((task) => task.completed)

	return (
		<Grid container spacing={2} justify='center' className={classes.taskView}>
			<Grid item sm={6}>
				<TaskViewPanel
					tasks={unfinishedTasks}
					title='Tasks'
					fallbackText='All done here!'
					onAdd={onAdd}
					onSelect={onSelect}
					onEdit={onEdit}
					onComplete={onComplete}
					onDelete={onDelete}
					allowAdd
				/>
			</Grid>
			<Grid item sm={6}>
				<TaskViewPanel
					tasks={completedTasks}
					title='Completed'
					fallbackText='No completed tasks.'
					onSelect={onSelect}
					onEdit={onEdit}
					onComplete={onComplete}
					onDelete={onDelete}
				/>
			</Grid>
		</Grid>
	)
}

TaskView.propTypes = {
	tasks: PropTypes.array.isRequired,
	onAdd: PropTypes.func,
	onComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
}

export default TaskView
