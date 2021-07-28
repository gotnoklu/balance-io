import React from 'react'
import PropTypes from 'prop-types'
import Dialog from './Dialog'
import TextField from './TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const BoardDialog = ( { isOpen, onClose, title, onSave } ) => {
	const [name, setName] = React.useState( '' )
	const [nameFieldHelperText, setNameFieldHelperText] = React.useState( null )
	const [isNameFieldError, setIsNameFieldError] = React.useState( false )

	React.useEffect( () => {
		setName( '' )
	}, [isOpen] )

	const handleSaveDetails = () => {
		if ( !name.length ) {
			setNameFieldHelperText( 'You need to supply a name for the board.' )
			return setIsNameFieldError( true )
		}

		return onSave( { boardName: name.trim() } )
	}

	const handleSetName = event => setName( event.target.value )

	const dialogActions = [
		<Button key='cancel' onClick={onClose}>
			Cancel
		</Button>,
		<Button key='save' color='secondary' onClick={handleSaveDetails}>
			Create Board
		</Button>,
	]

	return (
		<Dialog title={title} isOpen={isOpen} onClose={onClose} actions={dialogActions} fullWidth>
			<Typography variant='h6' component='h4' color='textSecondary' gutterBottom>
				Board Details
			</Typography>
			<TextField
				name='name'
				variant='outlined'
				label='Board Name'
				placeholder='Example: Version 1 Board'
				value={name}
				onChange={handleSetName}
				helperText={nameFieldHelperText && nameFieldHelperText}
				error={isNameFieldError}
			/>
		</Dialog>
	)
}

BoardDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	onSave: PropTypes.func.isRequired,
}

export default BoardDialog
