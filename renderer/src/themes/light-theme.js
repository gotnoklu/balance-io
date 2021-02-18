import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import coreTheme from './core-theme'

const lightColor = {
	300: '#ffffff',
	500: '#efefef',
	700: '#dfdfdf',
}

export default createMuiTheme( {
	...coreTheme,
	palette: {
		primary: {
			contrastText: 'rgba(10, 10, 10, 0.8)',
			light: lightColor[300],
			main: lightColor[500],
			dark: lightColor[700],
		},
		secondary: {
			contrastText: '#fff',
			light: blue[300],
			main: blue[500],
			dark: blue[700],
		},
		text: {
			primary: 'rgba(10, 10, 10, 0.8)',
			secondary: 'rgba(50, 50, 50, 0.7)',
		},
		background: {
			default: lightColor[300],
		},
	},
	overrides: {
		MuiAppBar: {
			root: {
				boxShadow: 'none',
			},
		},
		MuiTextField: {
			root: {
				'& label.Mui-focused': {
					color: blue[500],
				},
				'& .MuiOutlinedInput-root': {
					'&.Mui-focused fieldset': {
						borderColor: blue[500],
					},
				},
			},
		},
		MuiDrawer: {
			paper: {
				backgroundColor: '#fff',
			},
		},
		MuiPickersModal: {
			dialogRoot: {
				'& .MuiDialogActions-root': {
					'& button.MuiButton-text': {
						color: blue[500],
						'&:hover': {
							backgroundColor: blue[100],
						},
					},
				},
			},
		},
		MuiPickersToolbar: {
			toolbar: {
				backgroundColor: blue[700],
			},
		},
		MuiPickersToolbarText: {
			toolbarTxt: {
				color: blue[300],
			},
			toolbarBtnSelected: {
				color: '#fff',
			},
		},
		MuiPickersDay: {
			daySelected: {
				color: '#fff',
				backgroundColor: blue[500],
			},
		},
		MuiPickersYear: {
			yearSelected: {
				color: '#fff',
				backgroundColor: blue[500],
			},
		},
		MuiPickersClock: {
			pin: {
				backgroundColor: blue[500],
			},
		},
		MuiPickersClockPointer: {
			pointer: {
				backgroundColor: blue[500],
			},
			thumb: {
				backgroundColor: blue[700],
			},
		},
		MuiPickersClockNumber: {
			clockNumberSelected: {
				color: '#fff',
				backgroundColor: blue[500],
			},
		},
	},
} )
