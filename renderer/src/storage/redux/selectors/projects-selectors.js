export const getProjectsStore = state => state.projects

export const getProjectsList = state => getProjectsStore( state ).projects_list

export const getCurrentProjectId = state => getProjectsStore( state ).current_project_id
