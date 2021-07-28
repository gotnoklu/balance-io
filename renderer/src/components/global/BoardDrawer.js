import React from 'react'
import PropTypes from 'prop-types'
import MuiDrawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import BoardIcon from '@material-ui/icons/Dashboard'
import { drawerWidth, pageRoutes } from '../../constants/app'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentBoardId } from '../../storage/redux/actions'
import { getBoardsStore } from '../../storage/redux/selectors'
import { useRouter } from 'next/router'

const useStyles = makeStyles( theme => ( {
	root: {
		position: 'relative',
		height: '100%',
		overflow: 'hidden',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
		borderRight: `1px solid ${theme.palette.primary.main}`,
		color: theme.palette.primary.contrastText,
	},
	nested: {
		paddingLeft: theme.spacing( 4 ),
	},
	drawerTitle: {
		width: '100%',
	},
	drawerTitleText: {
		marginLeft: theme.spacing( 1 ),
	},
	drawerContent: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		overflowY: 'auto',
		paddingBottom: theme.spacing( 1 ),
	},
	drawerHeader: {
		backgroundColor: theme.palette.primary.main,
	},
} ) )

const BoardDrawer = ( { open } ) => {
	const classes = useStyles()
	const router = useRouter()
	const dispatch = useDispatch()

	const { boards_list, current_board_id } = useSelector( getBoardsStore )
	const currentBoard = boards_list.find( board => board.id === current_board_id )
	const filteredBoards = boards_list.filter( board => board.id !== current_board_id )

	const handleOpenBoardsPage = () => router.push( pageRoutes.BOARDS )

	const handleSelectBoard = boardId => dispatch( setCurrentBoardId( boardId ) )

	const drawer = (
		<div className={classes.root}>
			<Box
				width='100%'
				zIndex={4}
				position='absolute'
				top={0}
				left={0}
				className={classes.drawerHeader}>
				<Toolbar>
					<Box
						className={classes.drawerTitle}
						height='inherit'
						display='flex'
						alignItems='center'
						flexGrow={1}
						overflow='hidden'>
						<Typography variant='h5' component='h3' className={classes.drawerTitleText}>
							Boards
						</Typography>
					</Box>
					<IconButton color='secondary' onClick={handleOpenBoardsPage}>
						<SettingsIcon fontSize='small' />
					</IconButton>
				</Toolbar>
				<Divider />
			</Box>
			{Array.isArray( filteredBoards ) && (
				<Box className={classes.drawerContent}>
					<Toolbar />
					<List>
						<ListItem>
							<ListItemIcon>
								<BoardIcon color='secondary' fontSize='small' />
							</ListItemIcon>
							<ListItemText
								primary={
									<Typography variant='h6' color='secondary'>
										{currentBoard && currentBoard.name}
									</Typography>
								}
							/>
						</ListItem>
						<Divider />
						{filteredBoards.map( board => (
							<ListItem button onClick={() => handleSelectBoard( board.id )} key={board.id}>
								<ListItemIcon>
									<BoardIcon />
								</ListItemIcon>
								<ListItemText primary={<Typography variant='h6'>{board.name}</Typography>} />
							</ListItem>
						) )}
					</List>
				</Box>
			)}
		</div>
	)

	return (
		<nav className={classes.drawer} aria-label='iris board menu'>
			<MuiDrawer
				classes={{
					paper: classes.drawerPaper,
				}}
				anchor='left'
				variant='persistent'
				open={open}>
				{drawer}
			</MuiDrawer>
		</nav>
	)
}

BoardDrawer.propTypes = {
	open: PropTypes.bool,
}

export default BoardDrawer
