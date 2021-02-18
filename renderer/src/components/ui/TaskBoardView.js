import React from 'react'
import Box from '@material-ui/core/Box'
import TaskBoard from './TaskBoard'
import FallbackText from './FallbackText'
import { useSelector } from 'react-redux'
import { getBoardStore } from '../../storage/redux/selectors'

const TaskBoardView = () => {
	const { boards, current_board } = useSelector( getBoardStore )
	const currentBoard = boards.find( ( { id } ) => id === current_board )

	return (
		<Box width='100%' height='100%'>
			{currentBoard ? (
				<TaskBoard id={currentBoard.id} />
			) : (
				<Box display='flex' alignItems='center'>
					<FallbackText text='No boards available (Go to "Settings/Boards" to add a new board)' />
				</Box>
			)}
		</Box>
	)
}

export default TaskBoardView
