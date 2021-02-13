class Task {
	constructor(
		panel = null,
		id = null,
		name = '',
		description = '',
		completed = false,
		reminder = false
	) {
		this.panel = panel
		this.id = id
		this.name = name
		this.description = description
		this.completed = completed
		this.reminder = reminder
	}
}

export const isTask = value => value instanceof Task

export default Task
