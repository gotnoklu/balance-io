import { useContext } from 'react'
import { ThemeContext } from '../themes/theme'

const useTheme = () => useContext( ThemeContext )

export default useTheme
