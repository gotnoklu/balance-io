import { createReduxAction } from '../../../utilities/storage/redux'
import { projectsReducerActions } from '../../../constants/storage'

const {
	SET_PROJECTS_STORE,
	ADD_PROJECT,
	DELETE_PROJECT,
	DELETE_ALL_PROJECTS,
	DELETE_MULTIPLE_PROJECTS,
	SET_CURRENT_PROJECT_ID,
} = projectsReducerActions

export const setProjectsStore = state => createReduxAction( SET_PROJECTS_STORE, state )

export const addProject = project => createReduxAction( ADD_PROJECT, project )

export const deleteProject = projectId => createReduxAction( DELETE_PROJECT, projectId )

export const deleteAllProjects = () => createReduxAction( DELETE_ALL_PROJECTS )

export const deleteMultipleProjects = projectsList =>
	createReduxAction( DELETE_MULTIPLE_PROJECTS, projectsList )

export const setCurrentProjectId = projectId => createReduxAction( SET_CURRENT_PROJECT_ID, projectId )
