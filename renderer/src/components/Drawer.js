import React from 'react'
import PropTypes from 'prop-types'
import MuiDrawer from '@material-ui/core/Drawer'
import {
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	ListItemAvatar,
	ListItemSecondaryAction,
	Radio,
	Avatar,
	Typography,
	Button,
	Box,
	makeStyles,
	CircularProgress,
	MenuItem,
	Divider,
} from '@material-ui/core'
import ThemeIcon from '@material-ui/icons/InvertColors'
import BackupIcon from '@material-ui/icons/BackupOutlined'
import LightThemeIcon from '@material-ui/icons/BrightnessHigh'
import DarkThemeIcon from '@material-ui/icons/Brightness2'
import AutoBackupIcon from '@material-ui/icons/Restore'
import ManualBackupIcon from '@material-ui/icons/TouchApp'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { drawerWidth, themeTypes, backupTypes, times } from '../constants'
import TextField from './TextField'
import EffectBox from './EffectBox'
import { parseTimeStringFormat } from '../utilities/global'

const useStyles = makeStyles( theme => ( {
	drawer: {
		[theme.breakpoints.up( 'sm' )]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: theme.palette.primary.dark,
		borderRight: `1px solid ${theme.palette.primary.main}`,
		color: theme.palette.primary.contrastText,
	},
	nested: {
		paddingLeft: theme.spacing( 4 ),
	},
	avatar: {
		backgroundColor: theme.palette.primary.dark,
		border: `1px solid ${theme.palette.primary.main}`,
		color: theme.palette.primary.light,
	},
	loader: {
		marginTop: theme.spacing( 0.5 ),
		marginBottom: theme.spacing( 0.5 ),
	},
} ) )

const Drawer = ( {
	open,
	appTheme,
	backupType,
	onThemeChange,
	onBackupTypeChange,
	onAutoBackupTimeChange,
	onBackup,
} ) => {
	const [themeListOpen, setThemeListOpen] = React.useState( false )
	const [backupTypesListOpen, setBackupTypesListOpen] = React.useState( false )
	const [backupInProgress, setBackupInProgress] = React.useState( false )
	const [autoBackupTime, setAutoBackupTime] = React.useState( times.t30m )

	const classes = useStyles()

	const { LIGHT, DARK } = themeTypes
	const { AUTO, MANUAL } = backupTypes

	const handleToggleThemeList = () => setThemeListOpen( !themeListOpen )

	const handleToggleBackupTypesList = () => setBackupTypesListOpen( !backupTypesListOpen )

	const handleBackup = async () => {
		setBackupInProgress( true )
		await onBackup()
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
		await onBackupTypeChange( value, value === MANUAL ? null : await getDelay() )
	}

	const handleSetAutoBackupTime = async e => {
		const parsedTime = await parseTimeStringFormat()( e.target.value )
		await setAutoBackupTime( e.target.value )
		return await onAutoBackupTimeChange( {
			value: parsedTime.value,
			label: parsedTime.label,
			short: autoBackupTime,
		} )
	}

	React.useEffect( () => {
		const handleBackupStateLoad = async () => {
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

	const drawer = (
		<div>
			<List>
				<ListItem button onClick={handleToggleThemeList}>
					<ListItemAvatar>
						<Avatar className={classes.avatar}>
							<ThemeIcon color='secondary' />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Typography variant='body1' component='p' color='textPrimary'>
								Change Theme
							</Typography>
						}
						secondary={
							<Typography variant='h6' component='span' color='secondary'>
								{appTheme === DARK ? 'Dark' : 'Light'}
							</Typography>
						}
					/>
					{themeListOpen ? (
						<ExpandLessIcon color='secondary' />
					) : (
						<ExpandMoreIcon color='secondary' />
					)}
				</ListItem>
				<EffectBox effect='collapse' open={themeListOpen} unmountOnExit>
					<List component='div' disablePadding>
						<ListItem button className={classes.nested} onClick={() => onThemeChange( LIGHT )}>
							<ListItemIcon>
								<LightThemeIcon fontSize='small' color='secondary' />
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
									onChange={e => onThemeChange( e.target.value )}
									inputProps={{ 'aria-label': 'light' }}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem button className={classes.nested} onClick={() => onThemeChange( DARK )}>
							<ListItemIcon>
								<DarkThemeIcon fontSize='small' color='secondary' />
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
									onChange={e => onThemeChange( e.target.value )}
									inputProps={{ 'aria-label': 'dark' }}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					</List>
				</EffectBox>
				<ListItem button onClick={handleToggleBackupTypesList}>
					<ListItemAvatar>
						<Avatar className={classes.avatar}>
							<BackupIcon color='secondary' />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Typography variant='body1' component='p' color='textPrimary'>
								Backup
							</Typography>
						}
						secondary={
							<Typography variant='h6' component='span' color='secondary'>
								{backupType === AUTO ? 'Automatic' : 'Manual'}
							</Typography>
						}
					/>
					{backupTypesListOpen ? (
						<ExpandLessIcon color='secondary' />
					) : (
						<ExpandMoreIcon color='secondary' />
					)}
				</ListItem>
				<EffectBox effect='collapse' open={backupTypesListOpen} unmountOnExit>
					<List component='div' disablePadding>
						<ListItem
							button
							className={classes.nested}
							onClick={() => handleBackupTypeChange( AUTO )}>
							<ListItemIcon>
								<AutoBackupIcon fontSize='small' color='secondary' />
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
									checked={backupType === AUTO}
									onChange={e => handleBackupTypeChange( e.target.value )}
									inputProps={{ 'aria-label': 'automatic backup' }}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<EffectBox open={backupType === AUTO} className={classes.nested} unmountOnExit>
							<React.Fragment>
								<Box paddingTop={1} paddingBottom={1} paddingRight={3}>
									<TextField
										select
										value={autoBackupTime}
										onChange={handleSetAutoBackupTime}
										variant='outlined'
										label='Backup Delay'>
										<MenuItem value={times.t30m}>Every 30 minutes</MenuItem>
										<MenuItem value={times.t1h}>Every hour</MenuItem>
										<MenuItem value={times.t2h}>Every 2 hours</MenuItem>
										<MenuItem value={times.t3h}>Every 3 hours</MenuItem>
									</TextField>
								</Box>
								<Divider />
							</React.Fragment>
						</EffectBox>
						<ListItem
							button
							className={classes.nested}
							onClick={() => handleBackupTypeChange( MANUAL )}>
							<ListItemIcon>
								<ManualBackupIcon fontSize='small' color='secondary' />
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
									checked={backupType === MANUAL}
									onChange={e => handleBackupTypeChange( e.target.value )}
									inputProps={{ 'aria-label': 'manual backup' }}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					</List>
					<Box
						className={classes.nested}
						padding={2}
						display='flex'
						flexDirection='column'
						justifyContent='center'>
						<Button variant='outlined' color='secondary' onClick={handleBackup}>
							{!backupInProgress ? (
								<Typography variant='body1'>Backup Tasks</Typography>
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
				</EffectBox>
			</List>
		</div>
	)

	return (
		<nav className={classes.drawer} aria-label='iris app menu'>
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

Drawer.propTypes = {
	open: PropTypes.bool,
	appTheme: PropTypes.oneOf( ['LIGHT', 'DARK'] ),
	backupType: PropTypes.oneOf( ['AUTO', 'MANUAL'] ),
	onThemeChange: PropTypes.func,
	onBackupTypeChange: PropTypes.func,
	onBackup: PropTypes.func,
	onAutoBackupTimeChange: PropTypes.func,
}

export default Drawer
