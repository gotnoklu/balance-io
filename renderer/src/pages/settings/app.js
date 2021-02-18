import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Radio from '@material-ui/core/Radio'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import MenuItem from '@material-ui/core/MenuItem'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Link from 'next/Link'
import LightThemeIcon from '@material-ui/icons/WbSunnyRounded'
import DarkThemeIcon from '@material-ui/icons/Brightness2Rounded'
import AutoBackupIcon from '@material-ui/icons/RestoreRounded'
import ManualBackupIcon from '@material-ui/icons/TouchAppRounded'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import SettingsIcon from '@material-ui/icons/Settings'
import { themeTypes, backupTypes, durations, storageKeys, pageRoutes } from '../../constants'
import TextField from '../../components/ui/TextField'
import EffectBox from '../../components/ui/EffectBox'
import { parseTimeStringFormat } from '../../utilities/global'
import { backupMainAppStore, saveToMainAppStore } from '../../storage/electron-renderer'
import { getAppTheme, getAppBackupType, getAppAutoBackupDelay } from '../../storage/redux/selectors'
import { setAppBackupType, setAppAutoBackupDelay } from '../../storage/redux/actions'
import { useSelector, useDispatch } from 'react-redux'
import TimeChangeListener from '../../utilities/listeners/time-change-listener'

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

const backupDelayTimes = [
	{ value: durations.t30m, label: 'Every 30 minutes' },
	{ value: durations.t1h, label: 'Every hour' },
	{ value: durations.t2h, label: 'Every 2 hours' },
	{ value: durations.t3h, label: 'Every 3 hours' },
]

const AppSettingsPage = ( { setTheme } ) => {
	const [backupInProgress, setBackupInProgress] = React.useState( false )
	const [autoBackupTime, setAutoBackupTime] = React.useState( durations.t30m )

	const classes = useStyles()
	const dispatch = useDispatch()

	const appTheme = useSelector( getAppTheme )
	const appBackupType = useSelector( getAppBackupType )
	const appBackupDelay = useSelector( getAppAutoBackupDelay )

	const { LIGHT, DARK } = themeTypes
	const { AUTO, MANUAL } = backupTypes

	const setAutoBackupDelay = async delay => {
		const listener = new TimeChangeListener()
		listener.removeRepeatingListener( listener.id )
		if ( appBackupDelay && delay && delay.value !== appBackupDelay.value ) {
			listener.createRepeatingListener( delay.value, async () => {
				await backupMainAppStore()
			} )
		}
		await dispatch( setAppAutoBackupDelay( delay ) )
		await saveToMainAppStore( storageKeys.AUTO_BACKUP_DELAY, delay )
	}

	const setBackupType = async ( type, delay ) => {
		dispatch( setAppBackupType( type ) )
		await setAppAutoBackupDelay( delay )
		await saveToMainAppStore( storageKeys.BACKUP_TYPE, type )
	}

	const handleBackup = async () => {
		await setBackupInProgress( true )
		await backupMainAppStore()
	}

	const handleBackupTypeChange = async value => {
		const getDelay = () => {
			const parsedTime = parseTimeStringFormat()( autoBackupTime )
			return {
				value: parsedTime.value,
				label: parsedTime.label,
				short: autoBackupTime,
			}
		}
		await setBackupType( value, value === MANUAL ? null : await getDelay() )
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
		<Box padding={2}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card} variant='outlined'>
						<CardContent>
							<Box>
								<Typography variant='h6' component='h2' color='secondary' gutterBottom>
									Theme
								</Typography>
								<List component='div'>
									<ListItem>
										<ListItemIcon>
											<LightThemeIcon
												fontSize='small'
												color={appTheme === LIGHT ? 'secondary' : 'inherit'}
											/>
										</ListItemIcon>
										<ListItemText
											primary={
												<Typography component='p' color='textPrimary'>
													Light
												</Typography>
											}
										/>
										<ListItemSecondaryAction>
											<Radio
												value={LIGHT}
												checked={appTheme === LIGHT}
												onChange={e => setTheme( e.target.value )}
												inputProps={{ 'aria-label': 'light' }}
											/>
										</ListItemSecondaryAction>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<DarkThemeIcon
												fontSize='small'
												color={appTheme === DARK ? 'secondary' : 'inherit'}
											/>
										</ListItemIcon>
										<ListItemText
											primary={
												<Typography component='p' color='textPrimary'>
													Dark
												</Typography>
											}
										/>
										<ListItemSecondaryAction>
											<Radio
												value={DARK}
												checked={appTheme === DARK}
												onChange={e => setTheme( e.target.value )}
												inputProps={{ 'aria-label': 'dark' }}
											/>
										</ListItemSecondaryAction>
									</ListItem>
								</List>
							</Box>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card} variant='outlined'>
						<CardContent>
							<Typography variant='h6' component='h2' color='secondary' gutterBottom>
								Backup
							</Typography>
							<List component='div'>
								<ListItem>
									<ListItemIcon>
										<AutoBackupIcon
											fontSize='small'
											color={appBackupType === AUTO ? 'secondary' : 'inherit'}
										/>
									</ListItemIcon>
									<ListItemText
										primary={
											<Typography component='p' color='textPrimary'>
												Automatic Backup
											</Typography>
										}
									/>
									<ListItemSecondaryAction>
										<Radio
											value={AUTO}
											checked={appBackupType === AUTO}
											onChange={e => handleBackupTypeChange( e.target.value )}
											inputProps={{ 'aria-label': 'automatic backup' }}
										/>
									</ListItemSecondaryAction>
								</ListItem>
								<EffectBox open={appBackupType === AUTO} className={classes.nested} unmountOnExit>
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
									</React.Fragment>
								</EffectBox>
								<ListItem>
									<ListItemIcon>
										<ManualBackupIcon
											fontSize='small'
											color={appBackupType === MANUAL ? 'secondary' : 'inherit'}
										/>
									</ListItemIcon>
									<ListItemText
										primary={
											<Typography component='p' color='textPrimary'>
												Manual Backup
											</Typography>
										}
									/>
									<ListItemSecondaryAction>
										<Radio
											value={MANUAL}
											checked={appBackupType === MANUAL}
											onChange={e => handleBackupTypeChange( e.target.value )}
											inputProps={{ 'aria-label': 'manual backup' }}
										/>
									</ListItemSecondaryAction>
								</ListItem>
							</List>
							<Box paddingTop={2} display='flex' flexDirection='column' justifyContent='center'>
								<Button variant='contained' color='secondary' onClick={handleBackup}>
									{!backupInProgress ? (
										<Typography variant='button'>Backup Tasks</Typography>
									) : (
										<CircularProgress
											className={classes.loader}
											variant='indeterminate'
											color='secondary'
											size='16px'
										/>
									)}
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={6}>
					<Card className={classes.card} variant='outlined'>
						<CardContent>
							<Typography variant='h6' component='h2' color='secondary' gutterBottom>
								Other Settings
							</Typography>
							<List component='div'>
								<ListItem>
									<ListItemIcon>
										<SettingsIcon color='secondary' />
									</ListItemIcon>
									<Link href={pageRoutes.BOARDS}>
										<a className={classes.anchor}>
											<Button color='secondary' className={classes.linkButton}>
												<Typography component='span' variant='button'>
													Boards
												</Typography>
												<ArrowForwardIcon fontSize='small' className={classes.linkButtonIcon} />
											</Button>
										</a>
									</Link>
								</ListItem>
							</List>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	)
}

AppSettingsPage.propTypes = {
	setTheme: PropTypes.func,
}

export default AppSettingsPage
