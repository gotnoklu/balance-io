import React from 'react'
import PropTypes from 'prop-types'
import Dialog from './Dialog'
import TextField from './TextField'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CheckBox from '@material-ui/core/CheckBox'

const PanelDialog = ( { isOpen, onClose, title, onSave } ) => {
	const [name, setName] = React.useState( '' )
	const [allowAdd, setAllowAdd] = React.useState( false )
	const [allowDelete, setAllowDelete] = React.useState( false )
	const [nameFieldHelperText, setNameFieldHelperText] = React.useState( null )
	const [isNameFieldError, setIsNameFieldError] = React.useState( false )

	React.useEffect( () => {
		setName( '' )
	}, [isOpen] )

	const handleSaveDetails = () => {
		if ( !name.length ) {
			setNameFieldHelperText( 'You need to supply a name for the panel.' )
			return setIsNameFieldError( true )
		}

		return onSave( { panelName: name.trim(), allowAdd, allowDelete } )
	}

	const handleSetName = event => setName( event.target.value )

	const handleSetAllowAdd = canAdd => setAllowAdd( canAdd )

	const handleSetAllowDelete = canDelete => setAllowDelete( canDelete )

	const dialogActions = [
		<Button key='cancel' onClick={onClose}>
			Cancel
		</Button>,
		<Button key='save' color='secondary' onClick={handleSaveDetails} disabled={name.length === 0}>
			Save Panel
		</Button>,
	]

	return (
		<Dialog title={title} isOpen={isOpen} onClose={onClose} actions={dialogActions} fullWidth>
			<Typography variant='h6' component='h4' color='textSecondary' gutterBottom>
				Panel Details
			</Typography>
			<TextField
				name='name'
				variant='outlined'
				label='Panel Name'
				placeholder='Example: Completed Tasks'
				value={name}
				onChange={handleSetName}
				helperText={nameFieldHelperText && nameFieldHelperText}
				error={isNameFieldError}
			/>
			<Box paddingTop={2}>
				<Typography variant='h6' component='h5' color='textSecondary' gutterBottom>
					Panel Functions
				</Typography>
				<Box display='flex' alignItems='center'>
					<CheckBox checked={allowAdd} onChange={( event, canAdd ) => handleSetAllowAdd( canAdd )} />
					<Typography variant='body2' color={allowAdd ? 'secondary' : 'textPrimary'}>
						Add Tasks
					</Typography>
				</Box>
				<Box display='flex' alignItems='center'>
					<CheckBox
						checked={allowDelete}
						onChange={( event, canDelete ) => handleSetAllowDelete( canDelete )}
					/>
					<Typography variant='body2' color={allowDelete ? 'secondary' : 'textPrimary'}>
						Delete Tasks
					</Typography>
				</Box>
			</Box>
		</Dialog>
	)
}

PanelDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	onSave: PropTypes.func.isRequired,
}

export default PanelDialog
