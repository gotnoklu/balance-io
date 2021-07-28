import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import TabPanel from './TabPanel'
import { getProjectsList, getCurrentProjectId } from '../../storage/redux/selectors'
import { setCurrentProjectId } from '../../storage/redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import FallbackText from './FallbackText'
import ProjectsTabPanelItem from './ProjectsTabPanelItem'

const ProjectsTabPanel = ( { tabIndex, tabPanelIndex } ) => {
	const currentProjectId = useSelector( getCurrentProjectId )
	const projectsList = useSelector( getProjectsList )
	const dispatch = useDispatch()

	const handleSelectProject = ( selected, id ) => {
		if ( selected ) dispatch( setCurrentProjectId( id ) )
	}

	return (
		<TabPanel tabIndex={tabIndex} tabPanelIndex={tabPanelIndex}>
			{projectsList.length ? (
				<List component='ul' disablePadding>
					{projectsList.map( ( { id, name, description } ) => (
						<ProjectsTabPanelItem
							key={id}
							id={id}
							name={name}
							description={description}
							onSelect={handleSelectProject}
							currentProjectId={currentProjectId}
						/>
					) )}
				</List>
			) : (
				<React.Fragment>
					<FallbackText text='No projects available.' />
					<Button color='secondary'>Create a new project</Button>
				</React.Fragment>
			)}
		</TabPanel>
	)
}

ProjectsTabPanel.propTypes = {
	tabIndex: PropTypes.number.isRequired,
	tabPanelIndex: PropTypes.number.isRequired,
}

export default ProjectsTabPanel
