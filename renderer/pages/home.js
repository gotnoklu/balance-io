import React from 'react'
import Box from '@material-ui/core/Box'
import TaskBoardView from '../src/components/global/TaskBoardView'

function HomePage() {
	return (
		<Box width='100%' height='100%' component='section'>
			<TaskBoardView />
		</Box>
	)
}

export default HomePage
