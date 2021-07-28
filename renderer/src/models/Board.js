class Board {
	constructor( id = null, name = '', projectId ) {
		this.id = id.startsWith( 'board-' ) ? id : `board-${id}`
		this.name = name
		this.project_id = projectId
	}
}

export const isBoard = value => value instanceof Board

export default Board
