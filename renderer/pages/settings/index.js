import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/Link'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import PageIcon from '@material-ui/icons/Pageview'
import SettingsIcon from '@material-ui/icons/Settings'
import { pageRoutes } from '../../constants'
import { useSelector } from 'react-redux'
import { getCurrentBoard } from '../../storage/redux/selectors'

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
	pageButtonIcon: {
		marginRight: theme.spacing( 1 ),
	},
	anchor: {
		textDecoration: 'none',
	},
} ) )

const SettingsPage = () => {
	const classes = useStyles()
	const currentBoard = useSelector( getCurrentBoard )

	return (
		<Box padding={2}>
			<Grid container spacing={3}>
				<Grid item sm={12}>
					<Card className={classes.card} variant='outlined'>
						<CardContent>
							<Typography variant='h6' component='h2' color='secondary' gutterBottom>
								Settings
							</Typography>
							<List component='div'>
								<ListItem>
									<ListItemIcon>
										<SettingsIcon color='secondary' />
									</ListItemIcon>
									<Link href={pageRoutes.APP_SETTINGS}>
										<a className={classes.anchor}>
											<Button color='secondary' className={classes.linkButton}>
												<Typography component='span' variant='button'>
													Iris Settings
												</Typography>
												<ArrowForwardIcon fontSize='small' className={classes.linkButtonIcon} />
											</Button>
										</a>
									</Link>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<SettingsIcon color='secondary' />
									</ListItemIcon>
									<Link href={pageRoutes.BOARD_SETTINGS.replace( '[board_id]', currentBoard )}>
										<a className={classes.anchor}>
											<Button color='secondary' className={classes.linkButton}>
												<Typography component='span' variant='button'>
													Current Board Settings
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
				<Grid item sm={12}>
					<Card className={classes.card} variant='outlined'>
						<CardContent>
							<Typography variant='h6' component='h2' color='secondary' gutterBottom>
								Other Pages
							</Typography>
							<List component='div'>
								<ListItem>
									<ListItemIcon>
										<PageIcon color='secondary' />
									</ListItemIcon>
									<Link href={pageRoutes.HOME}>
										<a className={classes.anchor}>
											<Button color='secondary' className={classes.linkButton}>
												<ArrowBackIcon fontSize='small' className={classes.pageButtonIcon} />
												<Typography component='span' variant='button'>
													Home
												</Typography>
											</Button>
										</a>
									</Link>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<PageIcon color='secondary' />
									</ListItemIcon>
									<Link href={pageRoutes.BOARDS}>
										<a className={classes.anchor}>
											<Button color='secondary' className={classes.linkButton}>
												<ArrowBackIcon fontSize='small' className={classes.pageButtonIcon} />
												<Typography component='span' variant='button'>
													Boards
												</Typography>
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

export default SettingsPage
