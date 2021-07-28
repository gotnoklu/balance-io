class Task {
	/**
	 *
	 * @param {String | null} panel Unique ID of panel
	 * @param {String | null} id Unique ID of task
	 * @param {String} name Name of task
	 * @param {String} description Description of task
	 * @param {Boolean} completed Completed status of task
	 * @param {Boolean | Object} reminder Reminder status of task
	 */
	constructor( panelId = null, id = null, name = '', description = '', reminder = false ) {
		this.panel_id = panelId
		this.id = id.startsWith( 'task-' ) ? id : `task-${id}`
		this.name = name
		this.description = description
		this.reminder = reminder
	}
}

export const isTask = value => value instanceof Task

export default Task
