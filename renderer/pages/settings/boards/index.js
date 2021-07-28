import React from 'react'
import PropTypes from 'prop-types'
import {
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Typography,
	IconButton,
	Box,
	makeStyles,
	Paper,
	Divider,
} from '@material-ui/core'
import BoardIcon from '@material-ui/icons/DashboardRounded'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import AddIcon from '@material-ui/icons/Add'
import PanelsIcon from '@material-ui/icons/ViewWeekRounded'
import { boardTypes, pageRoutes, storageKeys } from '../../../constants'
import TextField from '../../../components/global/TextField'
import FallbackText from '../../../components/global/FallbackText'
import { saveToMainAppStore } from '../../../events/storage'
import { getBoardStore } from '../../../storage/redux/selectors'
import { addBoard, removeBoard, setBoardStore } from '../../../storage/redux/actions'
import { useSelector, useDispatch } from 'react-redux'
import Board from '../../../models/Board'
import { createId, findIndexFromArray } from '../../../utilities/global'
import { useRouter } from 'next/router'

const useStyles = makeStyles( theme => ( {
	paperTitle: {
		display: 'flex',
		flexGrow: 1,
	},
	paper: {
		height: '100%',
		position: 'relative',
		overflow: 'hidden',
		background: 'none',
	},
	paperTitleBox: {
		backgroundColor: theme.palette.primary.dark,
		zIndex: 2,
	},
	iconButton: {
		marginRight: theme.spacing( 2 ),
	},
	boardList: {
		overflowY: 'auto',
		overflow: 'hidden',
	},
} ) )

const BoardItem = ( { id, name, type, onEdit, onDelete } ) => {
	const [nameValue, setNameValue] = React.useState( name )
	const [isEditable, setIsEditable] = React.useState( false )

	const classes = useStyles()
	const router = useRouter()

	const handleToggleIsEditable = () => {
		if ( isEditable ) {
			onEdit( new Board( id, nameValue, type ) )
		}
		return setIsEditable( !isEditable )
	}

	const handleNameChange = e => setNameValue( e.target.value )

	const handleDeleteBoard = () => {
		if ( onDelete ) return onDelete( id )
	}

	const handleOpenBoardSettings = () => {
		return router.push( pageRoutes.BOARD_SETTINGS.replace( '[board_id]', id ) )
	}

	return (
		<ListItem>
			<ListItemIcon>
				<BoardIcon color='secondary' />
			</ListItemIcon>
			<Box display='flex' flexGrow={5}>
				{isEditable ? (
					<TextField
						variant='outlined'
						label='Board Name'
						placeholder='eg: Todo Board'
						value={nameValue}
						onChange={handleNameChange}
						fullWidth={false}
					/>
				) : (
					<ListItemText
						primary={
							<Typography component='p' color='textPrimary'>
								{nameValue}
							</Typography>
						}
					/>
				)}
			</Box>
			<Box display='flex' flexGrow={1} justifyContent='flex-end'>
				{type === boardTypes.CUSTOM && (
					<IconButton
						onClick={handleDeleteBoard}
						className={classes.iconButton}
						disabled={isEditable}>
						<DeleteIcon color={isEditable ? 'inherit' : 'error'} fontSize='small' />
					</IconButton>
				)}
				<IconButton
					color='secondary'
					onClick={handleOpenBoardSettings}
					className={classes.iconButton}
					disabled={isEditable}>
					<PanelsIcon fontSize='small' />
				</IconButton>
				{type === boardTypes.CUSTOM && (
					<IconButton color='secondary' onClick={handleToggleIsEditable}>
						{isEditable ? <CheckIcon fontSize='small' /> : <EditIcon fontSize='small' />}
					</IconButton>
				)}
			</Box>
		</ListItem>
	)
}

BoardItem.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	type: PropTypes.oneOf( [boardTypes.DEFAULT, boardTypes.CUSTOM] ),
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
}

const BoardsPage = () => {
	const classes = useStyles()
	const dispatch = useDispatch()

	const boardStore = useSelector( getBoardStore )
	const { boards } = boardStore

	const deleteBoard = boardId => dispatch( removeBoard( boardId ) )

	const handleAddBoard = async () => {
		const boardId = createId( 20 )
		const newBoard = new Board(
			boardId,
			'Empty Board Name (Click pencil icon to edit)',
			boardTypes.CUSTOM
		)
		await dispatch( addBoard( newBoard ) )
		await saveToMainAppStore( storageKeys.BOARDS_LIST, [...boards, newBoard] )
	}

	const handleDeleteBoard = async id => {
		await deleteBoard( id )
		await saveToMainAppStore( storageKeys.BOARDS_LIST, [...boards] )
	}

	const handleEditBoard = async details => {
		const copiedBoards = [...boards]
		copiedBoards[findIndexFromArray( copiedBoards, board => board.id === details.id )] = details
		await dispatch( setBoardStore( { ...boardStore, boards: [...copiedBoards] } ) )
		await saveToMainAppStore( storageKeys.BOARDS_LIST, [...copiedBoards] )
	}

	return (
		<Box padding={2} width='100%' height='100%'>
			<Paper className={classes.paper} variant='outlined'>
				<Box width='100%' height='100%'>
					<Box position='absolute' top={0} left={0} width='100%' className={classes.paperTitleBox}>
						<Box
							display='flex'
							alignItems='center'
							paddingTop={1}
							paddingBottom={1}
							paddingLeft={2}
							paddingRight={2}>
							<Typography
								variant='h6'
								component='h2'
								color='secondary'
								className={classes.paperTitle}
								gutterBottom>
								Boards
							</Typography>
							<IconButton onClick={handleAddBoard}>
								<AddIcon color='secondary' fontSize='small' />
							</IconButton>
						</Box>
						<Divider />
					</Box>
					<Box
						className={classes.boardList}
						position='absolute'
						top={0}
						left={0}
						right={0}
						bottom={0}
						paddingTop={7}
						paddingLeft={1}
						paddingBottom={1}
						paddingRight={1}
						height='100%'>
						{boards.length ? (
							<List component='div'>
								{boards.map( board => (
									<BoardItem
										key={board.id}
										id={board.id}
										name={board.name}
										type={board.type}
										onEdit={handleEditBoard}
										onDelete={handleDeleteBoard}
									/>
								) )}
							</List>
						) : (
							<Box display='flex' alignItems='center' width='100%' height='100%'>
								<FallbackText text='No boards (Click the "+" icon to add new boards)' />
							</Box>
						)}
					</Box>
				</Box>
			</Paper>
		</Box>
	)
}

export default BoardsPage
