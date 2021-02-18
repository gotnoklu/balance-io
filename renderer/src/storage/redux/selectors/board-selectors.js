export const getBoardStore = state => state.boards

export const getBoards = state => getBoardStore( state ).boards

export const getCurrentBoard = state => getBoardStore( state ).current_board
