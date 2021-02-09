import React from 'react'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import BackIcon from '@material-ui/icons/ArrowBack'
import clsx from 'clsx'
import { drawerWidth } from '../constants'

const useStyles = makeStyles((theme) => ({
	appBar: {
		backgroundColor: theme.palette.primary.dark,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	iconBar: {
		display: 'flex',
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
}))

const AppBar = ({ drawerOpen, onDrawerToggle, children }) => {
	const classes = useStyles()

	return (
		<MuiAppBar
			position='fixed'
			className={clsx(classes.appBar, {
				[classes.appBarShift]: drawerOpen,
			})}
		>
			<Toolbar>
				<IconButton
					color='secondary'
					aria-label='open drawer'
					edge='start'
					onClick={onDrawerToggle}
					className={classes.menuButton}
				>
					{drawerOpen ? <BackIcon /> : <MenuIcon />}
				</IconButton>
				<Box>
					<Typography variant='h3' component='h1' color='textPrimary'>
						Iris
					</Typography>
					<Typography variant='h6' component='h2' color='textSecondary'>
						Default Board
					</Typography>
				</Box>
			</Toolbar>
			{children}
		</MuiAppBar>
	)
}

AppBar.propTypes = {
	drawerOpen: PropTypes.bool,
	onDrawerToggle: PropTypes.func,
	children: PropTypes.node,
}

export default AppBar
