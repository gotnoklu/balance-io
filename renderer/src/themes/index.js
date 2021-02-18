import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import LightTheme from './light-theme'
import DarkTheme from './dark-theme'
import { saveToMainAppStore } from '../storage/electron-renderer'
import { setAppTheme } from '../storage/redux/actions'
import { getAppTheme } from '../storage/redux/selectors'
import { storageKeys, themeTypes } from '../constants'

const AppThemeContext = React.createContext()

const AppThemeConsumer = AppThemeContext.Consumer

const appThemes = {
	LIGHT: { theme: LightTheme, value: themeTypes.LIGHT },
	DARK: { theme: DarkTheme, value: themeTypes.DARK },
}

const AppThemeProvider = ( { children } ) => {
	const [currentTheme, setCurrentTheme] = React.useState( appThemes.LIGHT )
	const dispatch = useDispatch()

	const appTheme = useSelector( getAppTheme )

	const setTheme = theme => {
		setCurrentTheme( appThemes[theme] )
	}

	const toggleTheme = theme => {
		switch ( theme ) {
			case appThemes.LIGHT:
				setCurrentTheme( appThemes.DARK )
				break
			case appThemes.DARK:
				setCurrentTheme( appThemes.LIGHT )
				break
			default:
				break
		}
	}

	React.useEffect( () => {
		if ( appTheme ) {
			setCurrentTheme( appThemes[appTheme] )
		}
	}, [] )

	React.useEffect( () => {
		const handleSetTheme = async () => {
			if ( currentTheme ) {
				await dispatch( setAppTheme( currentTheme.value ) )
				await saveToMainAppStore( storageKeys.THEME, currentTheme.value )
			}
		}

		handleSetTheme()
	}, [currentTheme] )

	return (
		<ThemeProvider theme={currentTheme.theme}>
			<AppThemeContext.Provider value={{ setTheme, toggleTheme }}>
				{children}
			</AppThemeContext.Provider>
		</ThemeProvider>
	)
}

AppThemeProvider.propTypes = {
	children: PropTypes.node,
}

export default AppThemeProvider
export { AppThemeConsumer }
