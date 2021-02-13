class Panel {
	constructor( id = null, name = '', tasks = [] ) {
		this.id = id
		this.name = name
		this.tasks = tasks
	}
}

export const isPanel = value => value instanceof Panel

export default Panel
