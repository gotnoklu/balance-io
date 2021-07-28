import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import PropTypes from 'prop-types'
import TaskPanel from './TaskPanel'
import FallbackInfo from './FallbackInfo'
import { useSelector, useDispatch } from 'react-redux'
import { setPanelsStore } from '../../storage/redux/actions'
import { getPanelsByBoardId } from '../../storage/redux/selectors'
import { saveToStorage } from '../../events/storage'
import { storageKeys } from '../../constants/storage'
import Panel from '../../models/Panel'
import PanelDialog from './PanelDialog'
import { createId } from '../../utilities/global'

const useStyles = makeStyles( {
	taskBoard: {
		overflowX: 'auto',
	},
} )

const TaskBoard = ( { id, name } ) => {
	const [isDialogOpen, setIsDialogOpen] = React.useState( false )
	const classes = useStyles()
	const theme = useTheme()
	const boardPanels = useSelector( getPanelsByBoardId( id ) )
	const matchesMdDown = useMediaQuery( theme.breakpoints.down( 'md' ) )
	const dispatch = useDispatch()

	const handleOpenPanelDialog = () => setIsDialogOpen( true )

	const handleClosePanelDialog = () => setIsDialogOpen( false )

	const handleCreateNewPanel = async ( { panelName, allowAdd, allowDelete } ) => {
		const panelId = createId( 20 )
		const panelObject = new Panel( panelId, panelName, id, allowAdd, allowDelete )
		await dispatch( setPanelsStore( [panelObject] ) )
		await saveToStorage( storageKeys.PANELS, [panelObject] )
		return handleClosePanelDialog()
	}

	return Array.isArray( boardPanels ) && boardPanels.length ? (
		<Box
			width='100%'
			height='100%'
			display='flex'
			justifyContent={boardPanels.length <= 2 ? 'center' : 'flex-start'}
			className={classes.taskBoard}>
			{boardPanels.map( panel => (
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
			) )}
		</Box>
	) : (
		<React.Fragment>
			<PanelDialog
				isOpen={isDialogOpen}
				onClose={handleClosePanelDialog}
				title='Create New Panel'
				onSave={handleCreateNewPanel}
			/>
			<FallbackInfo
				title={`No panels available for board, ${name}.`}
				imageSrc='/images/empty-panels.svg'
				actionButtonProps={{ label: 'Create a panel', onClick: handleOpenPanelDialog }}
			/>
		</React.Fragment>
	)
}

TaskBoard.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
}

export default TaskBoard
