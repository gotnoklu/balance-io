import React from 'react'
import PropTypes from 'prop-types'
import Dialog from './Dialog'
import TextField from './TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const ProjectDialog = ( { isOpen, onClose, title, onSave } ) => {
	const [name, setName] = React.useState( '' )
	const [description, setDescription] = React.useState( '' )
	const [nameFieldHelperText, setNameFieldHelperText] = React.useState( null )
	const [isNameFieldError, setIsNameFieldError] = React.useState( false )

	React.useEffect( () => {
		setName( '' )
		setDescription( '' )
	}, [isOpen] )

	const handleSaveDetails = () => {
		if ( !name.length ) {
			setNameFieldHelperText( 'You need to supply a name for the project.' )
			return setIsNameFieldError( true )
		}

		return onSave( { projectName: name.trim(), projectDescription: description } )
	}

	const handleSetName = e => setName( e.target.value )

	const handleSetDescription = e => setDescription( e.target.value )

	const dialogActions = [
		<Button key='cancel' onClick={onClose}>
			Cancel
		</Button>,
		<Button key='save' color='secondary' onClick={handleSaveDetails}>
			Create Project
		</Button>,
	]

	return (
		<Dialog title={title} isOpen={isOpen} onClose={onClose} actions={dialogActions} fullWidth>
			<Typography variant='h6' component='h4' color='textSecondary' gutterBottom>
				Project Details
			</Typography>
			<TextField
				name='name'
				variant='outlined'
				label='Project Name'
				placeholder='Example: Learn Spanish'
				value={name}
				onChange={handleSetName}
				helperText={nameFieldHelperText && nameFieldHelperText}
				error={isNameFieldError}
			/>
			<TextField
				name='description'
				variant='outlined'
				label='Project Description (optional)'
				placeholder='Example: A project to manage tasks for learning Spanish'
				value={description}
				onChange={handleSetDescription}
			/>
		</Dialog>
	)
}

ProjectDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	onSave: PropTypes.func.isRequired,
}

export default ProjectDialog
