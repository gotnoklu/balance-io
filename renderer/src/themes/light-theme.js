import { createTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import { mintCream } from './colors'
import coreTheme from './core-theme'

export default createTheme( {
	...coreTheme,
	palette: {
		primary: {
			contrastText: mintCream.textPrimary,
			light: mintCream[200],
			main: mintCream[400],
			dark: mintCream[500],
		},
		secondary: {
			contrastText: mintCream[100],
			light: blue[300],
			main: blue[500],
			dark: blue[700],
		},
		text: {
			primary: mintCream.textPrimary,
			secondary: mintCream.textSecondary,
		},
		background: {
			default: mintCream.background,
		},
	},
	overrides: {
		MuiAppBar: {
			root: {
				boxShadow: 'none',
			},
		},
		MuiIconButton: {
			colorSecondary: {
				'&:hover': {
					transition: 'background-color 0.2s ease-in-out',
					backgroundColor: mintCream[600],
				},
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
				color: mintCream.textPrimary,
				backgroundColor: blue[500],
			},
		},
	},
} )
