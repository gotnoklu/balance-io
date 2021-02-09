import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const FallbackText = ({ text }) => {
	return (
		<Box width='100%' textAlign='center'>
			<Typography variant='h5' color='textSecondary'>
				{text || 'Fallback Text...'}
			</Typography>
		</Box>
	)
}

FallbackText.propTypes = {
	text: PropTypes.string,
}

export default FallbackText
