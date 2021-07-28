import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ( {
	'@global': {
		'*::-webkit-scrollbar': {
			width: '4px',
			height: '8px',
		},
		'*::-webkit-scrollbar-track': {
			backgroundColor: theme.palette.primary.dark,
		},
		'*::-webkit-scrollbar-thumb': {
			backgroundColor: theme.palette.secondary.main,
			'&:hover': {
				backgroundColor: theme.palette.secondary.dark,
			},
		},
	},
} )

export default withStyles( styles )( CssBaseline )
