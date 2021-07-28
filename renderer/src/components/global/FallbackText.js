import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const FallbackText = ( { variant, text } ) => {
	return (
		<Box width='100%' textAlign='center'>
			<Typography variant={variant || 'h6'} color='textSecondary' component='span' gutterBottom>
				{text || 'Fallback Text...'}
			</Typography>
		</Box>
	)
}

FallbackText.propTypes = {
	variant: PropTypes.oneOf( [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'body1',
		'body2',
		'caption',
		'subtitle1',
		'subtitle2',
	] ),
	text: PropTypes.string,
}

export default FallbackText
