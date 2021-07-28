import React from 'react'
import PropTypes from 'prop-types'
import Dialog from './Dialog'
import Button from '@material-ui/core/Button'

const DeleteDialog = ( { isOpen, onClose, selected, onDelete } ) => {
	const dialogActions = [
		<Button key='cancel' onClick={onClose}>
			Cancel
		</Button>,
		<Button key='delete' color='secondary' onClick={onDelete}>
			Delete tasks
		</Button>,
	]
	return (
		<Dialog title='Delete Tasks' isOpen={isOpen} onClose={onClose} actions={dialogActions}>
			{`You have selected ${selected} ${
				selected > 1 ? 'tasks' : 'task'
			} to be deleted. Click 'DELETE TASKS' to delete, or 'CANCEL' to cancel.`}
		</Dialog>
	)
}

DeleteDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	selected: PropTypes.number.isRequired,
	onDelete: PropTypes.func.isRequired,
}

export default DeleteDialog
