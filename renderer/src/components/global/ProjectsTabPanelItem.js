import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import ProjectIcon from '@material-ui/icons/BuildOutlined'
import MenuIcon from '@material-ui/icons/MoreVert'

const ProjectsTabPanelItem = ( { id, name, description, onSelect, currentProjectId } ) => {
	const [anchorEl, setAnchorEl] = React.useState( null )
	const isMenuOpen = Boolean( anchorEl )

	const handleOpenMenu = event => {
		return setAnchorEl( event.currentTarget )
	}

	const handleCloseMenu = () => {
		return setAnchorEl( null )
	}

	const handleDeleteProject = () => {
		return handleCloseMenu()
	}

	const handleEditProject = () => {
		return handleCloseMenu()
	}

	return (
		<React.Fragment>
			<ListItem>
				<ListItemIcon>
					<ProjectIcon fontSize='small' />
				</ListItemIcon>
				<ListItemText
					primary={
						<Typography variant='h6' component='p' color='textPrimary'>
							{name}
						</Typography>
					}
					secondary={
						<Typography variant='body2' component='p' color='textSecondary'>
							{description}
						</Typography>
					}
				/>
				<ListItemSecondaryAction>
					<IconButton onClick={handleOpenMenu}>
						<MenuIcon fontSize='small' />
					</IconButton>
					<Radio
						color='secondary'
						checked={id === currentProjectId}
						value='dark theme'
						onChange={( event, selected ) => onSelect( selected, id )}
					/>
				</ListItemSecondaryAction>
			</ListItem>
			<Menu open={isMenuOpen} anchorEl={anchorEl} onClose={handleCloseMenu}>
				<MenuItem value='edit' onClick={handleEditProject}>
					<Typography variant='body2'>Edit Project</Typography>
				</MenuItem>
				<MenuItem value='delete' onClick={handleDeleteProject}>
					<Typography color='error' variant='body2'>
						Delete Project
					</Typography>
				</MenuItem>
			</Menu>
		</React.Fragment>
	)
}

ProjectsTabPanelItem.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	onSelect: PropTypes.func,
	currentProjectId: PropTypes.string.isRequired,
}

export default ProjectsTabPanelItem
