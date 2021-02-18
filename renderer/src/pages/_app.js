import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import BoardSettingsIcon from '@material-ui/icons/Dashboard'
import SettingsIcon from '@material-ui/icons/Settings'
import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import React from 'react'
import AppBar from '../components/ui/AppBar'
import BoardDrawer from '../components/ui/BoardDrawer'
import CustomCssBaseline from '../components/ui/CustomCssBaseline'
import { pageConfigByRoute } from '../config/pages'
import { drawerWidth, settingTypes } from '../constants'
import AppThemeProvider, { AppThemeConsumer } from '../themes'
import storeWrapper from '../storage/redux/store'
import { useSelector } from 'react-redux'
import { getAppSettingOptions, getCurrentBoard } from '../storage/redux/selectors'

const settingOptions = {
	[settingTypes.SETTINGS]: {
		id: settingTypes.SETTINGS,
		icon: <SettingsIcon color='secondary' fontSize='small' />,
		label: 'Settings',
	},
	[settingTypes.APP]: {
		id: settingTypes.APP,
		icon: <SettingsIcon color='secondary' fontSize='small' />,
		label: 'Iris Settings',
	},
	[settingTypes.BOARD]: {
		id: settingTypes.BOARD,
		icon: <BoardSettingsIcon color='secondary' fontSize='small' />,
		label: 'Board Settings',
	},
}

function MyApp( props ) {
	const [isDrawerOpen, setIsDrawerOpen] = React.useState( false )

	const { Component, pageProps } = props

	const router = useRouter()
	const classes = useStyles( {
		hasDrawer: pageConfigByRoute[router.pathname].drawer,
	} )
	const currentBoard = useSelector( getCurrentBoard )
	const settings = useSelector( getAppSettingOptions )

	const handleToggleDrawer = () => setIsDrawerOpen( !isDrawerOpen )

	const renderAppBar = () => {
		const { pathname } = router
		if ( pageConfigByRoute[pathname].header ) {
			return (
				<AppBar
					drawerOpen={isDrawerOpen}
					onDrawerToggle={handleToggleDrawer}
					settings={settings.map( option => {
						if ( option !== settingTypes.BOARD ) return settingOptions[option]
						if ( currentBoard && option === settingTypes.BOARD ) return settingOptions[option]
						return null
					} )}
				/>
			)
		}
	}

	const renderDrawer = () => {
		const { pathname } = router
		if ( pageConfigByRoute[pathname].drawer ) {
			return <BoardDrawer open={isDrawerOpen} />
		}
	}

	React.useEffect( () => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector( '#jss-server-side' )
		if ( jssStyles ) {
			jssStyles.parentElement.removeChild( jssStyles )
		}
	}, [] )

	return (
		<React.Fragment>
			<Head>
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
			</Head>
			<AppThemeProvider>
				<CustomCssBaseline />
				<AppThemeConsumer>
					{( { setTheme } ) => (
						<div className={classes.root}>
							<main
								className={clsx( classes.content, {
									[classes.contentShift]: isDrawerOpen,
								} )}>
								<React.Fragment>
									{renderDrawer()}
									{renderAppBar()}
									<Toolbar />
									<Component setTheme={setTheme} {...pageProps} />
								</React.Fragment>
							</main>
						</div>
					)}
				</AppThemeConsumer>
			</AppThemeProvider>
		</React.Fragment>
	)
}

const useStyles = makeStyles( theme => ( {
	root: {
		width: '100%',
		height: '100vh',
		overflow: 'hidden',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		transition: theme.transitions.create( 'margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		} ),
		marginLeft: 0,
	},
	contentShift: ( { hasDrawer } ) => ( {
		marginLeft: hasDrawer ? drawerWidth : 0,
		transition: theme.transitions.create( 'margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		} ),
	} ),
} ) )

MyApp.getInitialProps = async ( { Component, ctx } ) => {
	return {
		pageProps: {
			...( Component.getInitialProps ? await Component.getInitialProps( ctx ) : {} ),
			pathname: ctx.pathname,
		},
	}
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
}

export default storeWrapper.withRedux( MyApp )
