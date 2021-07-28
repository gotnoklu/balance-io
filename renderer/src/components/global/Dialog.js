import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiDialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles( theme => ( {
	dialogTitle: {
		paddingTop: theme.spacing( 1 ),
		paddingBottom: theme.spacing( 1 ),
	},
	dialogPaper: ( { fullHeight } ) => ( {
		backgroundColor: theme.palette.primary.main,
		height: fullHeight ? '100%' : 'initial',
	} ),
} ) )

const Dialog = ( {
	isOpen,
	onClose,
	title,
	headerComponent,
	actions,
	fullWidth,
	fullHeight,
	children,
} ) => {
	const classes = useStyles( { fullHeight } )

	return (
		<MuiDialog
			classes={{ paper: classes.dialogPaper }}
			open={isOpen}
			onClose={onClose}
			fullWidth={fullWidth}>
			<MuiDialogTitle classes={{ root: classes.dialogTitle }}>
				<Box display='flex' alignItems='center' flexGrow={1}>
					<Box width='100%'>
						<Typography variant='h5' component='h4' color='textSecondary'>
							{title}
						</Typography>
					</Box>
					<IconButton color='secondary' edge='end' onClick={onClose}>
						<CloseIcon fontSize='small' />
					</IconButton>
				</Box>
				<React.Fragment>{headerComponent || null}</React.Fragment>
			</MuiDialogTitle>
			<MuiDialogContent>{children}</MuiDialogContent>
			<React.Fragment>
				{actions && <MuiDialogActions>{actions.map( action => action )}</MuiDialogActions>}
			</React.Fragment>
		</MuiDialog>
	)
}

Dialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	actions: PropTypes.array,
	fullWidth: PropTypes.bool,
	fullHeight: PropTypes.bool,
	headerComponent: PropTypes.element,
	children: PropTypes.node.isRequired,
}

export default Dialog
