import React from 'react'
import Slide from '@material-ui/core/Slide'
import Fade from '@material-ui/core/Fade'
import Collapse from '@material-ui/core/Collapse'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const useStyles = makeStyles( () => ( {
	effectBox: ( { width, height } ) => ( {
		width: typeof width === 'number' || typeof width === 'string' ? width : 'inherit',
		height: typeof height === 'number' || typeof height === 'string' ? height : 'inherit',
	} ),
} ) )

const createMountProps = ( mountOnEnter, unmountOnExit ) => ( { mountOnEnter, unmountOnExit } )

const EffectBox = ( {
	isOpen,
	effect,
	direction,
	width,
	height,
	mountOnEnter,
	unmountOnExit,
	className,
	onEnter,
	onExited,
	children,
} ) => {
	const classes = useStyles( { width, height } )

	const childBox = (
		<Box component='div' width='100%' height='100%'>
			{children}
		</Box>
	)

	const fadeBox = (
		<Fade
			className={clsx( classes.effectBox, className )}
			in={isOpen}
			timeout={300}
			onEnter={onEnter}
			onExited={onExited}
			{...createMountProps( mountOnEnter, unmountOnExit )}>
			{childBox}
		</Fade>
	)

	const slideBox = (
		<Slide
			className={clsx( classes.effectBox, className )}
			in={isOpen}
			timeout={300}
			direction={direction}
			onEnter={onEnter}
			onExited={onExited}
			{...createMountProps( mountOnEnter, unmountOnExit )}>
			{childBox}
		</Slide>
	)

	const collapseBox = (
		<Collapse
			className={clsx( classes.effectBox, className )}
			in={isOpen}
			timeout={300}
			onEnter={onEnter}
			onExited={onExited}
			{...createMountProps( mountOnEnter, unmountOnExit )}>
			{childBox}
		</Collapse>
	)

	switch ( effect ) {
		case 'fade': {
			return fadeBox
		}
		case 'zoom': {
			break
		}
		case 'slide': {
			return slideBox
		}
		case 'collapse': {
			return collapseBox
		}
		default: {
			return slideBox
		}
	}
}

EffectBox.propTypes = {
	isOpen: PropTypes.bool,
	effect: PropTypes.oneOf( ['slide', 'zoom', 'fade', 'collapse'] ),
	direction: PropTypes.oneOf( ['up', 'down', 'left', 'right'] ),
	width: PropTypes.oneOfType( [PropTypes.string, PropTypes.number] ),
	height: PropTypes.oneOfType( [PropTypes.string, PropTypes.number] ),
	mountOnEnter: PropTypes.bool,
	unmountOnExit: PropTypes.bool,
	onEnter: PropTypes.func,
	onExited: PropTypes.func,
	children: PropTypes.node,
}

export default EffectBox
