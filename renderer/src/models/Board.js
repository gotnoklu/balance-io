class Board {
	constructor( id = null, name = '', type ) {
		this.id = id.startsWith( 'board-' ) ? id : `board-${id}`
		this.name = name
		this.type = type
	}
}

export const isBoard = value => value instanceof Board

export default Board
