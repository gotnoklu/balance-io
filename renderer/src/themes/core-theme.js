import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
	typography: {
		fontFamily: [
			'RobotoMono',
			'Barlow',
			'Overpass',
			'Roboto',
			'-apple-system',
			'"Segoe UI"',
			'sans-serif',
		].join(','),
		h1: {
			fontFamily: 'RobotoMono-Bold',
			fontSize: '2.625rem',
		},
		h2: {
			fontFamily: 'RobotoMono-Bold',
			fontSize: '2.0625rem',
		},
		h3: {
			fontFamily: 'RobotoMono-Bold',
			fontSize: '1.625rem',
		},
		h4: {
			fontFamily: 'RobotoMono-Bold',
			fontSize: '1.25rem',
		},
		h5: {
			fontFamily: 'RobotoMono-Bold',
			fontSize: '1rem',
		},
		h6: {
			fontFamily: 'RobotoMono-Bold',
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
	},
})
