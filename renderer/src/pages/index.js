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
import { createId } from '../utilities/global'

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
			const createDefaultBoardAndPanels = async () => {
				const defaultBoard = new Board( createId( 20 ), 'Default Board', boardTypes.DEFAULT )

				setLoadingMessage( 'Creating default board...' )
				const saveDefaultBoard = await saveToMainAppStore( storageKeys.BOARDS, {
					current_board: defaultBoard.id,
					boards: [defaultBoard],
				} )

				if ( saveDefaultBoard.success ) {
					await dispatch(
						setBoardStore( getValueOfKey( saveDefaultBoard.response.data, storageKeys.BOARDS ) )
					)
				}

				setLoadingMessage( 'Creating default panels...' )
				const taskPanel = new Panel( createId( 20 ), 'Tasks', defaultBoard.id, true, true )
				const completedPanel = new Panel( createId( 20 ), 'Completed', defaultBoard.id, false, true )
				const saveDefaultPanels = await saveToMainAppStore( storageKeys.PANELS, [
					taskPanel,
					completedPanel,
				] )

				if ( saveDefaultPanels.success ) {
					await dispatch(
						setPanelStore( getValueOfKey( saveDefaultPanels.response.data, storageKeys.PANELS ) )
					)
				}
			}

			await setLoadingMessage( 'Getting storage...' )
			const getStorage = await getMainAppStore()
			if ( getStorage.success ) {
				setLoadingMessage( 'Performing back up...' )
				const backupResponse = await backupMainAppStore()
				if ( backupResponse.success ) {
					const appStore = await getValueOfKey( getStorage.response.data, storageKeys.APP )
					const boardStore = await getValueOfKey( getStorage.response.data, storageKeys.BOARDS )
					const panelStore = await getValueOfKey( getStorage.response.data, storageKeys.PANELS )
					const taskStore = await getValueOfKey( getStorage.response.data, storageKeys.TASKS )

					setLoadingMessage( 'Preparing Iris...' )
					await dispatch( setAppStore( appStore ) )

					if ( !boardStore.boards.length && !panelStore.length ) {
						await createDefaultBoardAndPanels()
					} else {
						await dispatch( setBoardStore( boardStore ) )
						await dispatch( setPanelStore( panelStore ) )
					}

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
