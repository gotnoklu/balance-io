import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiDialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
	dialogPaper: {
		backgroundColor: theme.palette.primary.main,
	},
}))

const Dialog = ({ open, onClose, title, actions, children }) => {
	const classes = useStyles()

	return (
		<MuiDialog classes={{ paper: classes.dialogPaper }} open={open} onClose={onClose}>
			<MuiDialogTitle>
				<span>
					<Typography variant='h5' component='h4'>
						{title}
					</Typography>
				</span>
			</MuiDialogTitle>
			<MuiDialogContent>{children}</MuiDialogContent>
			<MuiDialogActions>{actions.map((action) => action)}</MuiDialogActions>
		</MuiDialog>
	)
}

Dialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	actions: PropTypes.array.isRequired,
	children: PropTypes.node.isRequired,
}

export default Dialog
