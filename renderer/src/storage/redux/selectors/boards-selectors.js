export const getBoardsStore = state => state.boards

export const getBoardsList = state => getBoardsStore( state ).boards_list

export const getCurrentBoardId = state => getBoardsStore( state ).current_board_id

export const getBoardsByProjectId = project_id => state => {
	const boardsList = getBoardsList( state )
	return boardsList.filter( board => board.project_id === project_id )
}
