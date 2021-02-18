import { createReduxAction } from './creators'
import {
	SET_BOARD_STORE,
	ADD_BOARD,
	REMOVE_BOARD,
	REMOVE_ALL_BOARDS,
	SET_CURRENT_BOARD,
} from './types'

export const setBoardStore = state => createReduxAction( SET_BOARD_STORE, state )

export const addBoard = board => createReduxAction( ADD_BOARD, board )

export const removeBoard = id => createReduxAction( REMOVE_BOARD, id )

export const removeAllBoards = () => createReduxAction( REMOVE_ALL_BOARDS )

export const setCurrentBoard = board => createReduxAction( SET_CURRENT_BOARD, board )
