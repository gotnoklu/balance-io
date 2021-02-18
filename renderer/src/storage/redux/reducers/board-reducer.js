import { findIndexFromArray } from '../../../utilities/global'
import {
	SET_BOARD_STORE,
	ADD_BOARD,
	REMOVE_BOARD,
	REMOVE_ALL_BOARDS,
	SET_CURRENT_BOARD,
} from '../actions/types'
import { HYDRATE } from 'next-redux-wrapper'
import { isEqual } from 'lodash'

const defaultBoardState = {
	current_board: null,
	boards: [],
	_hydrated: false,
}

const boardReducer = ( state = defaultBoardState, action ) => {
	switch ( action.type ) {
		case HYDRATE: {
			let updatedState = { ...action.payload.boards, _hydrated: true }
			if ( isEqual( state, updatedState ) || state._hydrated ) updatedState = state
			return updatedState
		}
		case SET_BOARD_STORE: {
			return { ...state, ...action.payload }
		}
		case SET_CURRENT_BOARD: {
			return { ...state, current_board: action.payload }
		}
		case REMOVE_ALL_BOARDS: {
			return defaultBoardState
		}
		case REMOVE_BOARD: {
			const clonedState = { ...state }
			clonedState.boards.splice(
				findIndexFromArray( clonedState.boards, ( { id } ) => id === action.payload ),
				1
			)
			return clonedState
		}
		case ADD_BOARD: {
			return { currentBoard: state.currentBoard, boards: state.boards.concat( action.payload ) }
		}
		default:
			return { ...state }
	}
}

export default boardReducer
