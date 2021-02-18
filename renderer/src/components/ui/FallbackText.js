import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const FallbackText = ( { text } ) => {
	return (
		<Box width='100%' textAlign='center'>
			<Typography variant='h6' color='textSecondary' component='span'>
				{text || 'Fallback Text...'}
			</Typography>
		</Box>
	)
}

FallbackText.propTypes = {
	text: PropTypes.string,
}

export default FallbackText
