class Project {
	constructor( id = null, name = '', description = '', completed = false ) {
		this.id = id.startsWith( 'project-' ) ? id : `project-${id}`
		this.name = name
		this.description = description
		this.completed = completed
	}
}

export const isProject = value => value instanceof Project

export default Project
