import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Router from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { getStorage, backupStorage } from '../src/events/storage'
import { useDispatch, useSelector } from 'react-redux'
import {
	setAppStore,
	setTasksStore,
	setBoardsStore,
	setPanelsStore,
	setProjectsStore,
} from '../src/storage/redux/actions'
import { backupTypes } from '../src/constants/app'
import { storageKeys } from '../src/constants/storage'
import { getValueOfKey } from '../src/utilities/global'
import DurationListener from '../src/libraries/duration-listener'
import {
	getAppAutoBackupDelay,
	getAppBackupType,
	getProjectsList,
} from '../src/storage/redux/selectors'

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
	logo: {
		width: '100px',
		height: '100px',
		marginBottom: theme.spacing( 2 ),
	},
	loadingMessage: {
		marginTop: theme.spacing( 4 ),
		marginBottom: theme.spacing( 2 ),
	},
} ) )

const SplashPage = () => {
	const [isStoreBackedUp, setIsStoreBackedUp] = React.useState( false )
	const [isAutoDelaySet, setIsAutoDelaySet] = React.useState( false )
	const [loadingMessage, setLoadingMessage] = React.useState( 'Loading...' )

	const classes = useStyles()
	const dispatch = useDispatch()

	const appBackupDelay = useSelector( getAppAutoBackupDelay )
	const appBackupType = useSelector( getAppBackupType )
	const projectsList = useSelector( getProjectsList )

	React.useEffect( () => {
		const initApp = async () => {
			// Set current loading message
			setLoadingMessage( 'Getting storage...' )

			// Get data from main storage
			const mainAppStorage = await getStorage()

			if ( mainAppStorage.success ) {
				// Set current loading message
				setLoadingMessage( 'Performing back up...' )

				// Create backup
				const backupResponse = await backupStorage()

				if ( backupResponse.success ) {
					const responseData = mainAppStorage.response.data
					const appStore = await getValueOfKey( responseData, storageKeys.APP )
					const projectsStore = await getValueOfKey( responseData, storageKeys.PROJECTS )
					const boardsStore = await getValueOfKey( responseData, storageKeys.BOARDS )
					const panelsStore = await getValueOfKey( responseData, storageKeys.PANELS )
					const tasksStore = await getValueOfKey( responseData, storageKeys.TASKS )

					// Set current loading message
					setLoadingMessage( 'Setting things up for you...' )

					// Save store data into reducers
					await dispatch( setAppStore( appStore ) )
					await dispatch( setProjectsStore( projectsStore ) )
					await dispatch( setBoardsStore( boardsStore ) )
					await dispatch( setPanelsStore( panelsStore ) )
					await dispatch( setTasksStore( tasksStore ) )

					// Save backup process response to state
					await setIsStoreBackedUp( backupResponse.success )
				}
			}
		}

		initApp()
	}, [] )

	React.useEffect( () => {
		const handleSetAutoBackupListener = () => {
			if ( !isAutoDelaySet && appBackupDelay !== null && appBackupType === backupTypes.AUTO ) {
				const listener = new DurationListener()
				listener.removeRepeatingListener( listener.id )
				listener.createRepeatingListener( appBackupDelay, async () => {
					await backupStorage()
				} )
				setIsAutoDelaySet( true )
			}
		}

		handleSetAutoBackupListener()
	}, [appBackupDelay] )

	React.useEffect( () => {
		const { pathname } = Router
		if ( ( isStoreBackedUp || isAutoDelaySet ) && ( pathname === '/index' || pathname === '/' ) ) {
			if ( projectsList.length ) {
				Router.push( '/home' )
			} else {
				Router.push( '/no-projects' )
			}
		}
	}, [isStoreBackedUp, isAutoDelaySet] )

	return (
		<section className={classes.root}>
			<img className={classes.logo} src='/images/balance-128x128.png' alt='Balance.io' />
			<Typography className={classes.loadingMessage} component='h2' variant='body2' gutterBottom>
				{loadingMessage}
			</Typography>
			<CircularProgress variant='indeterminate' color='secondary' size='24px' />
		</section>
	)
}

export default SplashPage
