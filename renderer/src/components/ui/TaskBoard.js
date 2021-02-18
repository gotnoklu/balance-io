import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import PropTypes from 'prop-types'
import TaskPanel from './TaskPanel'
import FallbackText from './FallbackText'
import { useSelector } from 'react-redux'
import { getPanelsByBoard } from '../../storage/redux/selectors'

const useStyles = makeStyles( {
	taskBoard: {
		overflowX: 'auto',
	},
} )

const TaskBoard = ( { id } ) => {
	const classes = useStyles()
	const boardPanels = useSelector( getPanelsByBoard( id ) )
	const theme = useTheme()
	const matchesMdDown = useMediaQuery( theme.breakpoints.down( 'md' ) )

	return (
		<Box
			width='100%'
			height='100%'
			display='flex'
			justifyContent='center'
			className={classes.taskBoard}>
			{Array.isArray( boardPanels ) && boardPanels.length ? (
				boardPanels.map( panel => (
					<Box
						padding={2}
						height='100%'
						display='flex'
						flexShrink={0}
						flexBasis={matchesMdDown ? '50%' : '33.33%'}
						key={panel.id}>
						<TaskPanel
							id={panel.id}
							name={panel.name}
							allowAdd={panel.allowAdd}
							allowDelete={panel.allowDelete}
						/>
					</Box>
				) )
			) : (
				<Box width='inherit' height='inherit' display='flex' alignItems='center'>
					<FallbackText text='No panels available (Go to "Board Settings" to add a new panels)' />
				</Box>
			)}
		</Box>
	)
}

TaskBoard.propTypes = {
	id: PropTypes.string.isRequired,
}

export default TaskBoard
