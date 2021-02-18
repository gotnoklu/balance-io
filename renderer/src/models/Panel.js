class Panel {
	constructor( id = null, name = '', boardId, allowAdd = false, allowDelete = false ) {
		this.id = id.startsWith( 'panel-' ) ? id : `panel-${id}`
		this.name = name
		this.board = boardId
		this.allowAdd = allowAdd
		this.allowDelete = allowDelete
	}
}

export const isPanel = value => value instanceof Panel

export default Panel
