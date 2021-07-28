import React from 'react'
import Box from '@material-ui/core/Box'
import TaskBoard from './TaskBoard'
import { useSelector, useDispatch } from 'react-redux'
import { getBoardsStore, getCurrentProjectId } from '../../storage/redux/selectors'
import { createId } from '../../utilities/global'
import { setBoardsStore } from '../../storage/redux/actions'
import { storageKeys } from '../../constants/storage'
import { saveToStorage } from '../../events/storage'
import BoardDialog from './BoardDialog'
import Board from '../../models/Board'
import FallbackInfo from './FallbackInfo'

const TaskBoardView = () => {
	const [isDialogOpen, setIsDialogOpen] = React.useState( false )

	const { boards_list, current_board_id } = useSelector( getBoardsStore )
	const currentBoard = boards_list.length
		? boards_list.find( ( { id } ) => id === current_board_id )
		: null
	const currentProjectId = useSelector( getCurrentProjectId )

	const dispatch = useDispatch()

	const handleOpenBoardDialog = () => setIsDialogOpen( true )

	const handleCloseBoardDialog = () => setIsDialogOpen( false )

	const handleCreateNewBoard = async ( { boardName } ) => {
		const boardId = createId( 20 )
		const boardObject = new Board( boardId, boardName, currentProjectId )
		await dispatch( setBoardsStore( { boards_list: [boardObject], current_board_id: boardObject.id } ) )
		await saveToStorage( storageKeys.PROJECTS, {
			boards_list: [boardObject],
			current_board_id: boardObject.id,
		} )
		return handleCloseBoardDialog()
	}

	return (
		<Box width='100%' height='100%' component='div'>
			{currentBoard ? (
				<TaskBoard id={currentBoard.id} name={currentBoard.name} />
			) : (
				<Box width='100%' height='inherit' padding={2}>
					<BoardDialog
						isOpen={isDialogOpen}
						onClose={handleCloseBoardDialog}
						title='Create New Board'
						onSave={handleCreateNewBoard}
					/>
					<FallbackInfo
						title='This project has no boards.'
						imageSrc='/images/empty-boards.svg'
						actionButtonProps={{ label: 'Create your first board', onClick: handleOpenBoardDialog }}
					/>
				</Box>
			)}
		</Box>
	)
}

export default TaskBoardView
