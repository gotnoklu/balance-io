import { createTheme } from '@material-ui/core/styles'
import lightGreen from '@material-ui/core/colors/lightGreen'
import { charcoal, mintCream } from './colors'
import coreTheme from './core-theme'

export default createTheme( {
	...coreTheme,
	palette: {
		primary: {
			contrastText: charcoal.textPrimary,
			light: charcoal[300],
			main: charcoal[500],
			dark: charcoal[700],
		},
		secondary: {
			contrastText: charcoal.textPrimary,
			light: lightGreen[300],
			main: lightGreen[500],
			dark: lightGreen[700],
		},
		text: {
			primary: charcoal.textPrimary,
			secondary: charcoal.textSecondary,
		},
		background: {
			default: charcoal.background,
		},
	},
	overrides: {
		MuiAppBar: {
			root: {
				boxShadow: 'none',
			},
		},
		MuiIcon: {
			colorAction: {
				color: mintCream[500],
			},
		},
		MuiIconButton: {
			colorSecondary: {
				'&:hover': {
					transition: 'background-color 0.2s ease-in-out',
					backgroundColor: charcoal[400],
				},
			},
		},
		MuiMenu: {
			paper: {
				backgroundColor: charcoal[500],
			},
		},
		MuiMenuItem: {
			root: {
				'&:hover': {
					backgroundColor: charcoal[700],
				},
			},
		},
		MuiDrawer: {
			paper: {
				backgroundColor: charcoal[700],
			},
		},
		MuiPaper: {
			outlined: {
				borderColor: charcoal[500],
			},
		},
		MuiCard: {
			root: {
				borderColor: charcoal[500],
			},
		},
		MuiDivider: {
			root: {
				backgroundColor: charcoal[500],
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
		MuiOutlinedInput: {
			notchedOutline: {
				borderColor: charcoal[300],
			},
		},
		MuiPickersModal: {
			dialogRoot: {
				backgroundColor: charcoal[500],
				'& .MuiDialogActions-root': {
					'& button.MuiButton-text': {
						color: lightGreen[500],
						'&:hover': {
							backgroundColor: charcoal[900],
						},
					},
				},
			},
		},
		MuiPickersToolbar: {
			toolbar: {
				backgroundColor: charcoal[700],
			},
		},
		MuiPickersToolbarText: {
			toolbarTxt: {
				color: charcoal[300],
			},
			toolbarBtnSelected: {
				color: charcoal.textPrimary,
			},
		},
		MuiPickersCalendarHeader: {
			iconButton: {
				backgroundColor: charcoal[500],
			},
		},
		MuiPickersDay: {
			daySelected: {
				color: charcoal.textPrimary,
				backgroundColor: lightGreen[500],
			},
		},
		MuiPickersYear: {
			yearSelected: {
				color: charcoal.textPrimary,
				backgroundColor: charcoal[500],
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
				color: charcoal.textPrimary,
				backgroundColor: lightGreen[500],
			},
		},
	},
} )
