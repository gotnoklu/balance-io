class Board {
	constructor( id = null, name = '', panels = [] ) {
		this.id = id
		this.name = name
		this.panels = panels
	}
}

export const isBoard = value => value instanceof Board

export default Board
