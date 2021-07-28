import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import {
	closeWindow,
	restoreWindow,
	minimizeWindow,
	maximizeWindow,
	isWindowMaximized,
} from '../../events/window'

const useStyles = makeStyles( theme => ( {
	titleBar: {
		position: 'fixed',
		backgroundColor: theme.palette.primary.main,
		top: 0,
		left: 0,
		zIndex: theme.zIndex.appBar + 20,
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		height: '30px',
		lineHeight: '30px',
		WebkitUserSelect: 'none',
		WebkitAppRegion: 'drag',
	},
	windowTitle: {
		marginLeft: theme.spacing( 2 ),
	},
	controlsBox: {
		display: 'flex',
		flexGrow: 0,
		flexShrink: 0,
		textAlign: 'center',
		position: 'relative',
		zIndex: 3000,
		WebkitAppRegion: 'no-drag',
		height: '100%',
		width: '138px',
		marginLeft: 'auto',
	},
	controlButton: {
		width: '46px',
		height: '100%',
		fontFamily: 'codicon',
		borderRadius: '0px',
		minWidth: '0px',
	},
	closeControlButton: {
		'&:hover': {
			backgroundColor: theme.palette.error.main,
			color: theme.palette.error.contrastText,
		},
	},
	minimizeIcon: {
		'&:before': {
			content: '"\\eaba"',
		},
	},
	maximizeIcon: {
		'&:before': {
			content: ( { isMaximized } ) => ( isMaximized ? '"\\eabb"' : '"\\eab9"' ),
		},
	},
	closeIcon: {
		'&:before': {
			content: '"\\eab8"',
		},
	},
} ) )

const WindowTitleBar = () => {
	const [windowIsMaximized, setWindowIsMaximized] = React.useState( false )
	const classes = useStyles( {
		isMaximized: windowIsMaximized,
	} )

	const handleMinimizeWindow = () => minimizeWindow()

	const handleMaximizeOrRestoreWindow = async () => {
		const isMaximized = await isWindowMaximized()
		await setWindowIsMaximized( !isMaximized )
		if ( isMaximized ) {
			return await restoreWindow()
		}
		return await maximizeWindow()
	}

	const handleCloseWindow = async () => await closeWindow()

	return (
		<Box className={classes.titleBar}>
			<img style={{ marginLeft: '8px' }} src='/images/balance-32x32.png' width='16' height='16' />
			<Typography className={classes.windowTitle} variant='h6' color='textPrimary'>
				Balance.io
			</Typography>
			<Box className={classes.controlsBox}>
				<Button className={classes.controlButton} onClick={handleMinimizeWindow}>
					<Box className={classes.minimizeIcon}></Box>
				</Button>
				<Button className={classes.controlButton} onClick={handleMaximizeOrRestoreWindow}>
					<Box className={classes.maximizeIcon}></Box>
				</Button>
				<Button
					className={clsx( classes.controlButton, classes.closeControlButton )}
					onClick={handleCloseWindow}>
					<Box className={classes.closeIcon}></Box>
				</Button>
			</Box>
		</Box>
	)
}

export default WindowTitleBar
