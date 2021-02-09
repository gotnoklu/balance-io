import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import CustomCssBaseline from '../components/CustomCssBaseline'
import AppThemeProvider, { AppThemeConsumer } from '../themes'
import storeWrapper from '../utilities/store/redux/store'

function MyApp(props) {
	const { Component, pageProps } = props

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side')
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles)
		}
	}, [])

	return (
		<React.Fragment>
			<Head>
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
			</Head>
			<AppThemeProvider>
				<CustomCssBaseline />
				<AppThemeConsumer>
					{({ setAppTheme, toggleAppTheme }) => (
						<Component setAppTheme={setAppTheme} toggleTheme={toggleAppTheme} {...pageProps} />
					)}
				</AppThemeConsumer>
			</AppThemeProvider>
		</React.Fragment>
	)
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
	return {
		pageProps: {
			...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
			pathname: ctx.pathname,
		},
	}
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
}

export default storeWrapper.withRedux(MyApp)
