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
	Checkbox,
} from '@material-ui/core'
import PanelIcon from '@material-ui/icons/ViewWeekRounded'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import AddIcon from '@material-ui/icons/Add'
import { storageKeys, pageRoutes, boardTypes } from '../../../constants'
import TextField from '../../../components/global/TextField'
import FallbackText from '../../../components/global/FallbackText'
import { saveToMainAppStore } from '../../../events/storage'
import { getPanelStore, getBoardStore } from '../../../storage/redux/selectors'
import { removePanel, setPanelStore, addPanel } from '../../../storage/redux/actions'
import { useSelector, useDispatch } from 'react-redux'
import Panel from '../../../models/Panel'
import { createId, findIndexFromArray } from '../../../utilities/global'
import { useRouter } from 'next/router'

const useStyles = makeStyles( theme => ( {
	paperTitle: {
		display: 'flex',
		flexGrow: 1,
	},
	paper: {
		background: 'none',
		height: '100%',
		position: 'relative',
		overflow: 'hidden',
	},
	paperTitleBox: {
		backgroundColor: theme.palette.primary.dark,
		zIndex: 2,
	},
	deleteButton: {
		marginRight: theme.spacing( 2 ),
	},
	panelList: {
		overflowY: 'auto',
		overflow: 'hidden',
	},
} ) )

const PanelItem = ( { id, name, board, boardType, allowAdd, allowDelete, onEdit, onDelete } ) => {
	const [nameValue, setNameValue] = React.useState( name )
	const [isEditable, setIsEditable] = React.useState( false )
	const [addTasks, setAddTasks] = React.useState( allowAdd )
	const [deleteTasks, setDeleteTasks] = React.useState( allowDelete )

	const classes = useStyles()

	const handleToggleIsEditable = () => {
		if ( isEditable ) {
			onEdit( new Panel( id, nameValue, board, addTasks, deleteTasks ) )
		}
		return setIsEditable( !isEditable )
	}

	const handleNameChange = e => setNameValue( e.target.value )

	const handleDeletePanel = () => {
		if ( onDelete ) return onDelete( id )
	}

	const handleAddTasksChange = () => {
		setAddTasks( !addTasks )
		onEdit( new Panel( id, nameValue, board, !addTasks, deleteTasks ) )
	}

	const handleDeleteTasksChange = () => {
		setDeleteTasks( !deleteTasks )
		onEdit( new Panel( id, nameValue, board, addTasks, !deleteTasks ) )
	}

	return (
		<ListItem>
			<ListItemIcon>
				<PanelIcon color='secondary' />
			</ListItemIcon>
			<Box display='flex' flexGrow={5}>
				{isEditable ? (
					<TextField
						variant='outlined'
						label='Panel Name'
						placeholder='eg: In Progress Panel'
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
				<Box display='flex' alignItems='center' marginRight={2}>
					<Typography variant='body2'>Add Tasks</Typography>
					<Checkbox checked={addTasks} onChange={handleAddTasksChange} />
				</Box>
				<Box display='flex' alignItems='center' marginRight={2}>
					<Typography variant='body2'>Delete Tasks</Typography>
					<Checkbox checked={deleteTasks} onChange={handleDeleteTasksChange} />
				</Box>
				{boardType === boardTypes.CUSTOM && (
					<IconButton
						onClick={handleDeletePanel}
						className={classes.deleteButton}
						disabled={isEditable}>
						<DeleteIcon color={isEditable ? 'inherit' : 'error'} fontSize='small' />
					</IconButton>
				)}
				<IconButton color='secondary' onClick={handleToggleIsEditable}>
					{isEditable ? <CheckIcon fontSize='small' /> : <EditIcon fontSize='small' />}
				</IconButton>
			</Box>
		</ListItem>
	)
}

PanelItem.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	board: PropTypes.string.isRequired,
	boardType: PropTypes.oneOf( [boardTypes.DEFAULT, boardTypes.CUSTOM] ),
	allowAdd: PropTypes.bool,
	allowDelete: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
}

const BoardSettingsPage = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const router = useRouter()

	const { boards, current_board } = useSelector( getBoardStore )
	const panelStore = useSelector( getPanelStore )
	const panels = panelStore.panels.filter( panel => panel.board === current_board )

	const handleGetPanelsByPath = () => {
		const { asPath } = router
		const boardId = asPath.replace( `${pageRoutes.BOARDS}/`, '' )
		const selectedPanels = panels.filter( panel => panel.board === boardId )
		if ( selectedPanels ) return selectedPanels
		return null
	}

	const handleGetBoardTypeByPath = () => {
		const { asPath } = router
		const boardId = asPath.replace( `${pageRoutes.BOARDS}/`, '' )
		const board = boards.find( board => board.id === boardId )
		if ( board ) return board.type
		return null
	}

	const deletePanel = panelId => dispatch( removePanel( panelId ) )

	const handleAddPanel = async () => {
		const panelId = createId( 20 )
		const newPanel = new Panel(
			panelId,
			'Empty Panel Name (Click pencil icon to edit)',
			current_board
		)
		await dispatch( addPanel( newPanel ) )
		await saveToMainAppStore( storageKeys.PANELS, [...panels, newPanel] )
	}

	const handleDeletePanel = async id => {
		await deletePanel( id )
		await saveToMainAppStore( storageKeys.PANELS, [...panels] )
	}

	const handleEditPanel = async details => {
		const copiedPanels = [...panels]
		copiedPanels[findIndexFromArray( copiedPanels, panel => panel.id === details.id )] = details
		await dispatch( setPanelStore( [...copiedPanels] ) )
		await saveToMainAppStore( storageKeys.PANELS, [...copiedPanels] )
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
								Panels
							</Typography>
							<IconButton onClick={handleAddPanel}>
								<AddIcon color='secondary' fontSize='small' />
							</IconButton>
						</Box>
						<Divider />
					</Box>
					<Box
						className={classes.panelList}
						position='absolute'
						top={0}
						left={0}
						right={0}
						bottom={0}
						paddingTop={7}
						paddingLeft={1}
						paddingBottom={1}
						paddingRight={1}
						component='div'
						height='100%'>
						{( () => {
							const currentPanels = handleGetPanelsByPath()
							const boardType = handleGetBoardTypeByPath()
							return currentPanels.length ? (
								<List>
									{currentPanels.map( panel => (
										<PanelItem
											key={panel.id}
											id={panel.id}
											name={panel.name}
											board={panel.board}
											boardType={boardType}
											allowAdd={panel.allowAdd}
											allowDelete={panel.allowDelete}
											onEdit={handleEditPanel}
											onDelete={handleDeletePanel}
										/>
									) )}
								</List>
							) : (
								<Box display='flex' alignItems='center' width='100%' height='100%'>
									<FallbackText text='No panels (Click the "+" icon to add new panels)' />
								</Box>
							)
						} )()}
					</Box>
				</Box>
			</Paper>
		</Box>
	)
}

export default BoardSettingsPage
