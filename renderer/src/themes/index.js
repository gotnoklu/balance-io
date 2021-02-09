import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import LightTheme from './light-theme'
import DarkTheme from './dark-theme'
import { saveToMainAppStore } from '../utilities/store/electron-renderer'
import { setAppStoreTheme } from '../utilities/store/redux/actions'
import { getAppTheme } from '../utilities/store/redux/selectors'

const AppThemeContext = React.createContext()

const AppThemeConsumer = AppThemeContext.Consumer

const appThemes = {
	LIGHT: { theme: LightTheme, value: 'LIGHT' },
	DARK: { theme: DarkTheme, value: 'DARK' },
}

const AppThemeProvider = ({ children }) => {
	const [currentTheme, setCurrentTheme] = React.useState(appThemes.LIGHT)
	const dispatch = useDispatch()

	const appTheme = useSelector(getAppTheme)

	const setAppTheme = (theme) => {
		setCurrentTheme(appThemes[theme])
	}

	const toggleAppTheme = (theme) => {
		switch (theme) {
			case appThemes.LIGHT:
				setCurrentTheme(appThemes.DARK)
				break
			case appThemes.DARK:
				setCurrentTheme(appThemes.LIGHT)
				break
			default:
				break
		}
	}

	React.useEffect(() => {
		if (appTheme) {
			setCurrentTheme(appThemes[appTheme])
		}
	}, [])

	React.useEffect(() => {
		if (currentTheme) {
			dispatch(setAppStoreTheme(currentTheme.value))
			saveToMainAppStore('app.theme', currentTheme.value)
		}
	}, [currentTheme])

	return (
		<ThemeProvider theme={currentTheme.theme}>
			<AppThemeContext.Provider value={{ setAppTheme, toggleAppTheme }}>
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
