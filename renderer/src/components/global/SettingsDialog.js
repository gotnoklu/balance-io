import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import DarkThemeIcon from '@material-ui/icons/Brightness2Outlined'
import CheckIcon from '@material-ui/icons/Check'
import Dialog from './Dialog'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import MenuItem from '@material-ui/core/MenuItem'
import AutoBackupIcon from '@material-ui/icons/RestoreOutlined'
import ManualBackupIcon from '@material-ui/icons/TouchAppOutlined'
import { themeTypes, backupTypes, durations, backupDelayTimes } from '../../constants/app'
import { storageKeys } from '../../constants/storage'
import TextField from '../../components/global/TextField'
import EffectBox from '../../components/global/EffectBox'
import { parseTimeStringFormat } from '../../utilities/global'
import { backupStorage, saveToStorage } from '../../events/storage'
import { getAppBackupType, getAppAutoBackupDelay } from '../../storage/redux/selectors'
import { setAppBackupType, setAppAutoBackupDelay } from '../../storage/redux/actions'
import { useSelector, useDispatch } from 'react-redux'
import DurationListener from '../../libraries/duration-listener'

const useStyles = makeStyles( theme => ( {
	nested: {
		paddingLeft: theme.spacing( 4 ),
	},
	loader: {
		marginTop: theme.spacing( 0.5 ),
		marginBottom: theme.spacing( 0.5 ),
	},
	card: {
		height: '100%',
		backgroundColor: theme.palette.primary.main,
	},
	linkButton: {
		display: 'flex',
		alignItems: 'center',
	},
	linkButtonIcon: {
		marginLeft: theme.spacing( 1 ),
	},
	anchor: {
		textDecoration: 'none',
	},
} ) )

const SettingsDialog = ( { isOpen, onClose, themeType, onThemeToggle } ) => {
	const [backupInProgress, setBackupInProgress] = React.useState( false )
	const [autoBackupTime, setAutoBackupTime] = React.useState( durations.t30m )

	const { DARK } = themeTypes
	const { AUTO, MANUAL } = backupTypes

	const classes = useStyles()
	const dispatch = useDispatch()

	const appBackupType = useSelector( getAppBackupType )
	const appBackupDelay = useSelector( getAppAutoBackupDelay )

	const setAutoBackupDelay = async delay => {
		const listener = new DurationListener()
		listener.removeRepeatingListener( listener.id )
		if ( appBackupDelay && delay && delay.value !== appBackupDelay.value ) {
			listener.createRepeatingListener( delay.value, async () => {
				await backupStorage()
			} )
		}
		await dispatch( setAppAutoBackupDelay( delay ) )
		await saveToStorage( storageKeys.AUTO_BACKUP_DELAY, delay )
	}

	const setBackupType = async ( type, delay ) => {
		dispatch( setAppBackupType( type ) )
		await setAppAutoBackupDelay( delay )
		await saveToStorage( storageKeys.BACKUP_TYPE, type )
	}

	const handleBackup = async () => {
		await setBackupInProgress( true )
		await backupStorage()
	}

	const handleBackupTypeToggle = async () => {
		const getDelay = () => {
			const parsedTime = parseTimeStringFormat()( autoBackupTime )
			return {
				value: parsedTime.value,
				label: parsedTime.label,
				short: autoBackupTime,
			}
		}

		const type = appBackupType === MANUAL ? AUTO : MANUAL
		await setBackupType( type, type === MANUAL ? null : await getDelay() )
	}

	const handleSetAutoBackupDelay = async e => {
		const parsedTime = await parseTimeStringFormat()( e.target.value )
		await setAutoBackupTime( e.target.value )
		return await setAutoBackupDelay( {
			value: parsedTime.value,
			label: parsedTime.label,
			short: autoBackupTime,
		} )
	}

	React.useEffect( () => {
		const handleBackupStateLoad = () => {
			if ( backupInProgress ) {
				setTimeout( () => {
					setBackupInProgress( false )
				}, 5000 )
			}
		}

		handleBackupStateLoad()

		return () => {
			setBackupInProgress( false )
		}
	}, [backupInProgress] )

	return (
		<Dialog title='General Settings' isOpen={isOpen} onClose={onClose} fullWidth fullHeight>
			<List component='ul' disablePadding>
				<ListItem>
					<ListItemIcon>
						<DarkThemeIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography variant='h6' component='p' color='textPrimary'>
								Dark theme
							</Typography>
						}
						secondary={
							<Typography component='p' variant='body2' color='textSecondary'>
								Enable dark theme
							</Typography>
						}
					/>
					<ListItemSecondaryAction>
						<Switch
							color='secondary'
							checked={themeType === DARK}
							value='dark theme'
							onChange={onThemeToggle}
						/>
					</ListItemSecondaryAction>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<AutoBackupIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography variant='h6' component='p' color='textPrimary'>
								Automatic backup
							</Typography>
						}
						secondary={
							<Typography component='span' variant='body2' color='textSecondary'>
								Enable automatic backup with a time delay
							</Typography>
						}
					/>
					<ListItemSecondaryAction>
						<Switch
							color='secondary'
							checked={appBackupType === AUTO}
							value='automatic backup'
							onChange={handleBackupTypeToggle}
						/>
					</ListItemSecondaryAction>
				</ListItem>
				<EffectBox
					effect='collapse'
					isOpen={appBackupType === AUTO}
					className={classes.nested}
					unmountOnExit>
					<React.Fragment>
						<Box paddingTop={1} paddingBottom={1} paddingRight={3}>
							<TextField
								select
								value={autoBackupTime}
								onChange={handleSetAutoBackupDelay}
								variant='outlined'
								label='Backup every...'>
								{backupDelayTimes.map( ( { value, label } ) => (
									<MenuItem value={value} key={value}>
										{label}
									</MenuItem>
								) )}
							</TextField>
						</Box>
						<Divider />
					</React.Fragment>
				</EffectBox>
				<ListItem button onClick={handleBackup}>
					<ListItemIcon>
						<ManualBackupIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography variant='h6' component='p' color='secondary'>
								Backup Balance.io data
							</Typography>
						}
						secondary={
							<Typography component='p' variant='body2' color='textSecondary'>
								Backup all your data. Automatic backup does this for you if enabled
							</Typography>
						}
					/>
					<ListItemSecondaryAction>
						{backupInProgress ? (
							<CircularProgress
								className={classes.loader}
								variant='indeterminate'
								color='secondary'
								size='16px'
							/>
						) : (
							<CheckIcon color='secondary' fontSize='small' />
						)}
					</ListItemSecondaryAction>
				</ListItem>
			</List>
		</Dialog>
	)
}

SettingsDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	themeType: PropTypes.string.isRequired,
	onThemeToggle: PropTypes.func.isRequired,
}

export default SettingsDialog
