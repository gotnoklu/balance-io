import { createReduxAction } from '../../../utilities/storage/redux'
import { boardsReducerActions } from '../../../constants/storage'

const {
	SET_BOARDS_STORE,
	ADD_BOARD,
	DELETE_BOARD,
	DELETE_ALL_BOARDS,
	DELETE_MULTIPLE_BOARDS,
	SET_CURRENT_BOARD_ID,
} = boardsReducerActions

export const setBoardsStore = state => createReduxAction( SET_BOARDS_STORE, state )

export const addBoard = board => createReduxAction( ADD_BOARD, board )

export const deleteBoard = boardId => createReduxAction( DELETE_BOARD, boardId )

export const deleteAllBoards = () => createReduxAction( DELETE_ALL_BOARDS )

export const deleteMultipleBoards = boardsList =>
	createReduxAction( DELETE_MULTIPLE_BOARDS, boardsList )

export const setCurrentBoardId = boardId => createReduxAction( SET_CURRENT_BOARD_ID, boardId )
