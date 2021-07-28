import { createTheme } from '@material-ui/core/styles'

export default createTheme( {
	typography: {
		fontFamily: [
			'Lexend Deca',
			'Barlow',
			'Overpass',
			'Roboto',
			'-apple-system',
			'"Segoe UI"',
			'sans-serif',
		].join( ',' ),
		h1: {
			fontFamily: 'Lexend Deca',
			fontSize: '2.625rem',
		},
		h2: {
			fontFamily: 'Lexend Deca',
			fontSize: '2.0625rem',
		},
		h3: {
			fontFamily: 'Lexend Deca',
			fontSize: '1.625rem',
		},
		h4: {
			fontFamily: 'Lexend Deca',
			fontSize: '1.25rem',
		},
		h5: {
			fontFamily: 'Lexend Deca',
			fontSize: '1rem',
		},
		h6: {
			fontFamily: 'Lexend Deca',
			fontSize: '0.8125rem',
		},
		body1: {
			fontFamily: 'Barlow',
			fontSize: '1rem',
		},
		body2: {
			fontFamily: 'Barlow',
		},
		subtitle1: {
			fontFamily: 'Barlow',
		},
		subtitle2: {
			fontFamily: 'Barlow',
		},
		caption: {
			fontFamily: 'Barlow',
		},
		button: {
			fontFamily: 'Lexend Deca',
			textTransform: 'none',
		},
	},
} )
