import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(() => ({
	addButton: {
		position: 'fixed',
		right: '32px',
		bottom: '32px',
	},
	addIcon: {
		marginRight: '16px',
	},
}))

const AddButton = ({ onAdd }) => {
	const classes = useStyles()
	return (
		<Fab className={classes.addButton} color='secondary' variant='extended' onClick={onAdd}>
			<AddIcon className={classes.addIcon} />
			<Typography variant='h6' component='span'>
				Add Task
			</Typography>
		</Fab>
	)
}

AddButton.propTypes = {
	onAdd: PropTypes.func.isRequired,
}

export default AddButton
