import { findIndexFromArray } from '../../../utilities/global'
import { boardsReducerActions } from '../../../constants/storage'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const {
	SET_BOARDS_STORE,
	ADD_BOARD,
	DELETE_BOARD,
	DELETE_ALL_BOARDS,
	DELETE_MULTIPLE_BOARDS,
	SET_CURRENT_BOARD_ID,
} = boardsReducerActions

const defaultBoardsStore = {
	current_board_id: null,
	boards_list: [],
}

const compareStates = ( defaultState, oldState, newState ) => {
	const isAllStatesEqual = isEqual( oldState, newState )
	const isNewStateReset = isEqual( newState, defaultState )
	console.log( { defaultState, oldState, newState } )
	if ( isAllStatesEqual || isNewStateReset ) return oldState
	return newState
}

const boardsReducer = ( state = defaultBoardsStore, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = { ...action.payload.boards }
			return compareStates( defaultBoardsStore, state, updatedState )
		}
		case SET_BOARDS_STORE: {
			return { ...state, ...action.payload }
		}
		case SET_CURRENT_BOARD_ID: {
			return { ...state, current_board_id: action.payload }
		}
		case DELETE_ALL_BOARDS: {
			return defaultBoardsStore
		}
		case DELETE_MULTIPLE_BOARDS: {
			const storedBoards = [...state.boards_list]
			const boardsToBeDeleted = action.payload
			boardsToBeDeleted.forEach( boardId =>
				storedBoards.splice(
					findIndexFromArray( storedBoards, ( { id } ) => id === boardId ),
					1
				)
			)
			return { ...state, boards_list: storedBoards }
		}
		case DELETE_BOARD: {
			const clonedState = { ...state }
			clonedState.boards_list.splice(
				findIndexFromArray( clonedState.boards, ( { id } ) => id === action.payload ),
				1
			)
			return clonedState
		}
		case ADD_BOARD: {
			return {
				currentBoard: state.currentBoard,
				boards_list: state.boards_list.concat( action.payload ),
			}
		}
		default:
			return { ...state }
	}
}

export default boardsReducer
