import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import PropTypes from 'prop-types'
import CustomCssBaseline from './CustomCssBaseline'
import { ThemeProvider } from '../../themes/theme'
import storeWrapper from '../../storage/redux/store'
import WindowTitleBar from './WindowTitleBar'

const BaseApp = ( { children } ) => {
	const classes = useStyles()

	return (
		<React.Fragment>
			<Head>
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
			</Head>
			<ThemeProvider>
				<CustomCssBaseline />
				<div className={classes.root}>
					<main className={classes.content}>
						<WindowTitleBar />
						{children}
					</main>
				</div>
			</ThemeProvider>
		</React.Fragment>
	)
}

const useStyles = makeStyles( {
	root: {
		width: '100%',
		height: '100vh',
		overflow: 'hidden',
	},
	content: {
		paddingTop: '30px',
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		marginLeft: 0,
	},
	toolbar: {
		top: '30px',
	},
} )

BaseApp.propTypes = {
	children: PropTypes.node,
}

export default storeWrapper.withRedux( BaseApp )
