import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FallbackText from '../src/components/global/FallbackText'
import { useDispatch } from 'react-redux'
import ProjectDialog from '../src/components/global/ProjectDialog'
import Project from '../src/models/Project'
import { createId } from '../src/utilities/global'
import { setProjectsStore } from '../src/storage/redux/actions'
import { storageKeys } from '../src/constants/storage'
import { saveToStorage } from '../src/events/storage'
import Router from 'next/router'
import FallbackInfo from '../src/components/global/FallbackInfo'

const NoProjectsPage = () => {
	const [isDialogOpen, setIsDialogOpen] = React.useState( false )
	const dispatch = useDispatch()

	const handleOpenProjectDialog = () => setIsDialogOpen( true )

	const handleCloseProjectDialog = () => setIsDialogOpen( false )

	const handleCreateNewProject = async ( { projectName, projectDescription } ) => {
		const projectId = createId( 20 )
		const projectObject = new Project( projectId, projectName, projectDescription, false )
		await dispatch(
			setProjectsStore( { projects_list: [projectObject], current_project_id: projectObject.id } )
		)
		await saveToStorage( storageKeys.PROJECTS, {
			projects_list: [projectObject],
			current_project_id: projectObject.id,
		} )
		handleCloseProjectDialog()
		return Router.replace( '/home' )
	}

	return (
		<Box width='100%' height='inherit' padding={2}>
			<ProjectDialog
				isOpen={isDialogOpen}
				onClose={handleCloseProjectDialog}
				title='Create New Project'
				onSave={handleCreateNewProject}
			/>
      <FallbackInfo title='Uh... No projects.' imageSrc='/images/empty-projects.svg' actionButtonProps={{label: 'Create your first project', onClick: handleOpenProjectDialog}} />
		</Box>
	)
}

export default NoProjectsPage
