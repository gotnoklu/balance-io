import React from 'react'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import CheckBoxBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

const useStyles = makeStyles(() => ({
	deleteBar: {
		display: 'flex',
		width: '100%',
		alignItems: 'center',
	},
	margin: {
		marginLeft: '16px',
	},
}))

const DeleteBar = ({ selected, selectionDisabled }) => {
	const [allSelected, setAllSelected] = React.useState(false)

	const classes = useStyles()

	const handleToggleAllSelected = () => {
		setAllSelected(!allSelected)
	}

	return (
		<div className={classes.deleteBar}>
			<IconButton color='secondary' onClick={handleToggleAllSelected} disabled={selectionDisabled}>
				{allSelected ? <CheckBoxIcon fontSize='small' /> : <CheckBoxBlankIcon fontSize='small' />}
			</IconButton>
			<Typography variant='h6' className={classes.margin}>
				{selectionDisabled ? 'None to select/delete.' : `${selected} selected.`}
			</Typography>
			<Button
				className={classes.margin}
				color='secondary'
				variant='outlined'
				disabled={selectionDisabled}
			>
				Delete
			</Button>
		</div>
	)
}

DeleteBar.propTypes = {
	selected: PropTypes.number.isRequired,
	selectionDisabled: PropTypes.bool,
}

export default DeleteBar
