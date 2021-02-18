import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Router from 'next/router'
import { Avatar, Typography, CircularProgress } from '@material-ui/core'
import {
	getMainAppStore,
	backupMainAppStore,
	saveToMainAppStore,
} from '../storage/electron-renderer'
import { useDispatch, useSelector } from 'react-redux'
import { setAppStore, setTaskStore, setBoardStore, setPanelStore } from '../storage/redux/actions'
import { storageKeys, boardTypes, backupTypes } from '../constants'
import { getValueOfKey } from '../utilities/global'
import TimeChangeListener from '../utilities/listeners/time-change-listener'
import { Board, Panel } from '../models'
import { getAppAutoBackupDelay, getAppBackupType } from '../storage/redux/selectors'

const useStyles = makeStyles( theme => ( {
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		overflowY: 'hidden',
	},
	avatar: {
		width: '100px',
		height: '100px',
		marginBottom: theme.spacing( 2 ),
	},
	margin: {
		marginTop: theme.spacing( 4 ),
		marginBottom: theme.spacing( 2 ),
	},
} ) )

function SplashPage() {
	const [isStoreBackedUp, setIsStoreBackedUp] = React.useState( false )
	const [isAutoDelaySet, setIsAutoDelaySet] = React.useState( false )
	const [loadingMessage, setLoadingMessage] = React.useState( 'Loading...' )

	const classes = useStyles()
	const dispatch = useDispatch()

	const appBackupDelay = useSelector( getAppAutoBackupDelay )
	const appBackupType = useSelector( getAppBackupType )

	React.useEffect( () => {
		const initAppStore = async () => {
			await setLoadingMessage( 'Getting storage...' )
			const storageResponse = await getMainAppStore()
			if ( storageResponse.success ) {
				setLoadingMessage( 'Performing back up...' )
				const backupResponse = await backupMainAppStore()
				if ( backupResponse.success ) {
					const appStore = await getValueOfKey( storageResponse.data, storageKeys.APP )
					const boardStore = await getValueOfKey( storageResponse.data, storageKeys.BOARDS )
					const panelStore = await getValueOfKey( storageResponse.data, storageKeys.PANELS )
					const taskStore = await getValueOfKey( storageResponse.data, storageKeys.TASKS )

					await dispatch( setAppStore( appStore ) )

					if ( !boardStore.boards.length ) {
						setLoadingMessage( 'Creating default board...' )
						const defaultBoard = new Board( 'DEFAULT_BOARD', 'Default Board', boardTypes.DEFAULT )
						await saveToMainAppStore( storageKeys.BOARDS, {
							current_board: boardTypes.DEFAULT,
							boards: [defaultBoard],
						} )
					}

					if ( !panelStore.length ) {
						setLoadingMessage( 'Creating default panels...' )
						const taskPanel = new Panel( 'TASK_PANEL', 'Tasks', 'DEFAULT_BOARD', true, true )
						const completedPanel = new Panel(
							'COMPLETED_PANEL',
							'Completed',
							'DEFAULT_BOARD',
							false,
							true
						)
						await saveToMainAppStore( storageKeys.PANELS, [taskPanel, completedPanel] )
					}

					setLoadingMessage( 'Preparing Iris...' )
					await dispatch( setBoardStore( boardStore ) )
					await dispatch( setPanelStore( panelStore ) )
					await dispatch( setTaskStore( taskStore ) )
					await setIsStoreBackedUp( backupResponse.success )
					setLoadingMessage( 'Setting things up for you...' )
				}
			}
		}

		initAppStore()
	}, [] )

	React.useEffect( () => {
		const handleSetAutoBackupListener = () => {
			if ( !isAutoDelaySet && appBackupDelay !== null && appBackupType === backupTypes.AUTO ) {
				const listener = new TimeChangeListener()
				listener.removeRepeatingListener( listener.id )
				listener.createRepeatingListener( appBackupDelay, async () => {
					await backupMainAppStore()
				} )
				setIsAutoDelaySet( true )
			}
		}

		handleSetAutoBackupListener()
	}, [appBackupDelay] )

	React.useEffect( () => {
		const { pathname } = Router
		if ( ( isStoreBackedUp || isAutoDelaySet ) && ( pathname === '/index' || pathname === '/' ) ) {
			Router.push( '/home' )
		}
	}, [isStoreBackedUp, isAutoDelaySet] )

	return (
		<section className={classes.root}>
			<Avatar className={classes.avatar} src='/images/iris.png' />
			<Typography variant='h1' component='h1' gutterBottom>
				Iris
			</Typography>
			<Typography className={classes.margin} component='h2' variant='body1' gutterBottom>
				{loadingMessage}
			</Typography>
			<CircularProgress variant='indeterminate' color='secondary' size='24px' />
		</section>
	)
}

export default SplashPage
