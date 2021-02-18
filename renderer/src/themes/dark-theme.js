import { createMuiTheme } from '@material-ui/core/styles'
import lightGreen from '@material-ui/core/colors/lightGreen'
import coreTheme from './core-theme'

const darkColor = {
	300: '#666666',
	500: '#444444',
	700: '#222222',
	900: '#121212',
}

export default createMuiTheme( {
	...coreTheme,
	palette: {
		primary: {
			contrastText: '#fff',
			light: darkColor[300],
			main: darkColor[500],
			dark: darkColor[700],
		},
		secondary: {
			contrastText: '#222222',
			light: lightGreen[300],
			main: lightGreen[500],
			dark: lightGreen[700],
		},
		text: {
			primary: '#fefefe',
			secondary: '#bbbbbb',
		},
		background: {
			default: darkColor[900],
		},
	},
	overrides: {
		MuiAppBar: {
			root: {
				boxShadow: 'none',
			},
		},
		MuiMenu: {
			paper: {
				backgroundColor: darkColor[500],
			},
		},
		MuiMenuItem: {
			root: {
				'&:hover': {
					backgroundColor: darkColor[700],
				},
			},
		},
		MuiDrawer: {
			paper: {
				backgroundColor: darkColor[700],
			},
		},
		MuiPaper: {
			outlined: {
				borderColor: darkColor[500],
			},
		},
		MuiCard: {
			root: {
				borderColor: darkColor[500],
			},
		},
		MuiDivider: {
			root: {
				backgroundColor: darkColor[500],
			},
		},
		MuiTextField: {
			root: {
				'& label.Mui-focused': {
					color: '#fff',
				},
				'& .MuiOutlinedInput-root': {
					'&.Mui-focused fieldset': {
						borderColor: '#fff',
					},
				},
			},
		},
		MuiPickersModal: {
			dialogRoot: {
				backgroundColor: darkColor[500],
				'& .MuiDialogActions-root': {
					'& button.MuiButton-text': {
						color: lightGreen[500],
						'&:hover': {
							backgroundColor: darkColor[900],
						},
					},
				},
			},
		},
		MuiPickersToolbar: {
			toolbar: {
				backgroundColor: darkColor[700],
			},
		},
		MuiPickersToolbarText: {
			toolbarTxt: {
				color: darkColor[300],
			},
			toolbarBtnSelected: {
				color: '#fff',
			},
		},
		MuiPickersCalendarHeader: {
			iconButton: {
				backgroundColor: darkColor[500],
			},
		},
		MuiPickersDay: {
			daySelected: {
				color: '#fff',
				backgroundColor: lightGreen[500],
			},
		},
		MuiPickersYear: {
			yearSelected: {
				color: '#fff',
				backgroundColor: darkColor[500],
			},
		},
		MuiPickersClock: {
			pin: {
				backgroundColor: lightGreen[500],
			},
		},
		MuiPickersClockPointer: {
			pointer: {
				backgroundColor: lightGreen[500],
			},
			thumb: {
				backgroundColor: lightGreen[700],
			},
		},
		MuiPickersClockNumber: {
			clockNumberSelected: {
				color: '#fff',
				backgroundColor: lightGreen[500],
			},
		},
	},
} )
