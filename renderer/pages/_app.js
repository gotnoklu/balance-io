import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import AppBar from '../src/components/global/AppBar'
import { pageConfigByRoute } from '../src/config/pages'
import { ThemeConsumer } from '../src/themes/theme'
import storeWrapper from '../src/storage/redux/store'
import SettingsDialog from '../src/components/global/SettingsDialog'
import WorkspaceDialog from '../src/components/global/WorkspaceDialog'
import BaseApp from '../src/components/core/BaseApp'

function MyApp( props ) {
	const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = React.useState( false )
	const [isSettingsDialogOpen, setIsSettingsDialogOpen] = React.useState( false )

	const { Component, pageProps } = props

	const router = useRouter()

	const renderAppBar = () => {
		const { pathname } = router
		if ( pageConfigByRoute[pathname].header ) {
			return (
				<React.Fragment>
					<AppBar
						onWorkspaceDialogOpen={() => setIsWorkspaceDialogOpen( true )}
						onSettingsDialogOpen={() => setIsSettingsDialogOpen( true )}
					/>
					<Toolbar />
				</React.Fragment>
			)
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
		<BaseApp>
			<React.Fragment>
				{renderAppBar()}
				<WorkspaceDialog
					isOpen={isWorkspaceDialogOpen}
					onClose={() => setIsWorkspaceDialogOpen( false )}
				/>
				<ThemeConsumer>
					{( { themeType, handleThemeToggle } ) => (
						<SettingsDialog
							isOpen={isSettingsDialogOpen}
							onClose={() => setIsSettingsDialogOpen( false )}
							themeType={themeType}
							onThemeToggle={handleThemeToggle}
						/>
					)}
				</ThemeConsumer>
				<Component {...pageProps} />
			</React.Fragment>
		</BaseApp>
	)
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
}

export default storeWrapper.withRedux( MyApp )
