import React from 'react'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import BoardIcon from '@material-ui/icons/DashboardRounded'
import BackIcon from '@material-ui/icons/ArrowBack'
import MenuIcon from '@material-ui/icons/MoreVert'
import clsx from 'clsx'
import { drawerWidth, settingTypes, pageRoutes } from '../../constants'
import { useSelector, useDispatch } from 'react-redux'
import { setAppSelectedSetting } from '../../storage/redux/actions'
import { getAppSelectedSetting, getBoardStore } from '../../storage/redux/selectors'
import { useRouter } from 'next/router'

const useStyles = makeStyles( theme => ( {
	appBar: {
		background: 'none',
		transition: theme.transitions.create( ['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		} ),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create( ['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		} ),
	},
	marginRight: {
		marginRight: theme.spacing( 2 ),
	},
} ) )

const AppBar = ( { drawerOpen, onDrawerToggle, settings } ) => {
	const [anchorEl, setAnchorEl] = React.useState( false )

	const classes = useStyles()
	const dispatch = useDispatch()
	const router = useRouter()

	const selectedSetting = useSelector( getAppSelectedSetting )
	const { boards, current_board } = useSelector( getBoardStore )
	const currentBoard = boards.find( board => board.id === current_board )

	const handleGetBoardByPath = () => {
		const { asPath } = router
		const boardId = asPath.replace( `${pageRoutes.BOARDS}/`, '' )
		const selectedBoard = boards.find( board => board.id === boardId )
		if ( selectedBoard ) return selectedBoard.name
		return 'No board selected'
	}

	const handleOpenMenu = e => setAnchorEl( e.currentTarget )

	const handleCloseMenu = () => setAnchorEl( null )

	const handleMenuItemClick = e => {
		dispatch( setAppSelectedSetting( e.currentTarget.dataset.value ) )
		handleCloseMenu()
	}

	const renderTitleByRoute = () => {
		switch ( router.pathname ) {
			case pageRoutes.SETTINGS:
				return 'Settings'
			case pageRoutes.APP_SETTINGS:
				return 'Iris Settings'
			case pageRoutes.BOARDS:
				return 'Boards'
			case pageRoutes.BOARD_SETTINGS:
				return 'Board Settings'
		}
	}

	const handleGoBack = () => {
		dispatch( setAppSelectedSetting( null ) )
		router.back()
	}

	React.useEffect( () => {
		const { pathname } = router
		if ( pathname === pageRoutes.HOME ) {
			switch ( selectedSetting ) {
				case settingTypes.SETTINGS:
					return router.push( pageRoutes.SETTINGS )
				case settingTypes.APP:
					return router.push( pageRoutes.APP_SETTINGS )
				case settingTypes.BOARD:
					return router.push( {
						pathname: pageRoutes.BOARD_SETTINGS.replace( '[board_id]', current_board ),
					} )
				default:
					break
			}
		}

		return () => {
			dispatch( setAppSelectedSetting( null ) )
		}
	}, [selectedSetting] )

	const homePageAppBar = (
		<MuiAppBar
			position='fixed'
			className={clsx( classes.appBar, {
				[classes.appBarShift]: drawerOpen,
			} )}>
			<Toolbar>
				<IconButton
					color='secondary'
					aria-label='open drawer'
					edge='start'
					onClick={onDrawerToggle}
					className={classes.marginRight}>
					{drawerOpen ? <BackIcon /> : <BoardIcon />}
				</IconButton>
				<Box display='flex' flexDirection='column' flexGrow={1}>
					<Typography variant='h3' component='h1' color='textPrimary'>
						Iris
					</Typography>
					<Typography variant='h6' component='h3' color='textSecondary'>
						{currentBoard ? currentBoard.name : 'No board selected'}
					</Typography>
				</Box>
				<IconButton color='secondary' aria-label='open menu' edge='end' onClick={handleOpenMenu}>
					<MenuIcon />
				</IconButton>
				<Menu
					open={Boolean( anchorEl )}
					anchorEl={anchorEl}
					onBackdropClick={handleCloseMenu}
					onClose={handleCloseMenu}>
					{settings.map(
						option =>
							option !== null && (
								<MenuItem
									data-value={option.id}
									className={classes.menuItem}
									onClick={handleMenuItemClick}
									key={option.id}>
									<ListItemIcon>{option.icon || null}</ListItemIcon>
									<ListItemText primary={option.label} />
								</MenuItem>
							)
					)}
				</Menu>
			</Toolbar>
			<Divider />
		</MuiAppBar>
	)

	const settingsPageAppBar = (
		<MuiAppBar position='fixed' className={classes.appBar}>
			<Toolbar>
				<IconButton
					color='secondary'
					aria-label='go back'
					edge='start'
					onClick={handleGoBack}
					className={classes.marginRight}>
					<BackIcon />
				</IconButton>
				<Box display='flex' flexDirection='column' flexGrow={1}>
					<Typography variant='h5' component='h1' color='secondary'>
						{renderTitleByRoute()}
					</Typography>
					{router.pathname === pageRoutes.BOARD_SETTINGS && (
						<Typography variant='h6' component='h2' color='textSecondary'>
							{handleGetBoardByPath()}
						</Typography>
					)}
				</Box>
			</Toolbar>
			<Divider />
		</MuiAppBar>
	)

	if ( router.pathname === pageRoutes.HOME ) {
		return homePageAppBar
	}

	if ( router.pathname.startsWith( pageRoutes.SETTINGS ) ) {
		return settingsPageAppBar
	}

	return null
}

AppBar.propTypes = {
	drawerOpen: PropTypes.bool,
	onDrawerToggle: PropTypes.func,
	settings: PropTypes.array.isRequired,
}

export default AppBar
