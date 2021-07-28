import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FallbackText from './FallbackText'
import PropTypes from 'prop-types'

const FallbackInfo = ( { title, imageSrc, actionButtonProps } ) => {
	const actionButtonLabel = actionButtonProps.label || null
	const onActionButtonClick = actionButtonProps.onClick || null

	return (
		<Box
			width='100%'
			height='inherit'
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'>
			<FallbackText variant='h5' text={title} />
			<img src={imageSrc} width='300' height='300' />
			{actionButtonProps && (
				<Button color='secondary' variant='contained' onClick={onActionButtonClick}>
					{actionButtonLabel}
				</Button>
			)}
		</Box>
	)
}

FallbackInfo.propTypes = {
	title: PropTypes.string.isRequired,
	imageSrc: PropTypes.string.isRequired,
	actionButtonProps: PropTypes.object,
}

export default FallbackInfo
