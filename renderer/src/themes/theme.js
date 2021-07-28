import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import LightTheme from './light-theme'
import DarkTheme from './dark-theme'
import { saveToStorage } from '../events/storage'
import { setAppThemeType } from '../storage/redux/actions'
import { getAppThemeType } from '../storage/redux/selectors'
import { themeTypes } from '../constants/app'
import { storageKeys } from '../constants/storage'

const ThemeContext = React.createContext( {
	themeType: null,
} )

const ThemeConsumer = ThemeContext.Consumer

const themes = {
	LIGHT: LightTheme,
	DARK: DarkTheme,
}

const ThemeProvider = ( { children } ) => {
	const currentThemeType = useSelector( getAppThemeType )
	const currentTheme = themes[currentThemeType]

	const dispatch = useDispatch()

	const handleThemeToggle = async () => {
		switch ( currentThemeType ) {
			case themeTypes.LIGHT: {
				await saveToStorage( storageKeys.THEME, themeTypes.DARK )
				return await dispatch( setAppThemeType( themeTypes.DARK ) )
			}
			case themeTypes.DARK: {
				await saveToStorage( storageKeys.THEME, themeTypes.LIGHT )
				return await dispatch( setAppThemeType( themeTypes.LIGHT ) )
			}
			default:
				break
		}
	}

	const handleThemeChange = async theme => {
		await saveToStorage( storageKeys.THEME, theme )
		dispatch( setAppThemeType( theme ) )
	}

	return (
		<MuiThemeProvider theme={currentTheme}>
			<ThemeContext.Provider
				value={{ themeType: currentThemeType, handleThemeChange, handleThemeToggle }}>
				{children}
			</ThemeContext.Provider>
		</MuiThemeProvider>
	)
}

ThemeProvider.propTypes = {
	children: PropTypes.node,
}

export { ThemeProvider, ThemeContext, ThemeConsumer }
