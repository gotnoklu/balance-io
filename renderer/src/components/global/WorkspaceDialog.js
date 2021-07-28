import React from 'react'
import PropTypes from 'prop-types'
import Dialog from './Dialog'
import Tabs from './Tabs'
import ProjectsTabPanel from './ProjectsTabPanel'
import BoardsTabPanel from './BoardsTabPanel'
import PanelsTabPanel from './PanelsTabPanel'

const WorkspaceDialog = ( { isOpen, onClose } ) => {
	const [currentTabIndex, setCurrentTabIndex] = React.useState( 0 )

	const handleTabChange = ( event, tabIndex ) => {
		setCurrentTabIndex( tabIndex )
	}

	return (
		<Dialog
			title='Workspace'
			isOpen={isOpen}
			onClose={onClose}
			headerComponent={
				<Tabs
					tabs={[
						{ index: 0, label: 'Projects' },
						{ index: 1, label: 'Boards' },
						{ index: 2, label: 'Panels' },
					]}
					currentTabIndex={currentTabIndex}
					onChange={handleTabChange}
					ariaLabel='boards and panels tabs'
				/>
			}
			fullWidth
			fullHeight>
			<ProjectsTabPanel tabIndex={currentTabIndex} tabPanelIndex={0} />
			<BoardsTabPanel tabIndex={currentTabIndex} tabPanelIndex={1} />
			<PanelsTabPanel tabIndex={currentTabIndex} tabPanelIndex={2} />
		</Dialog>
	)
}

WorkspaceDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
}

export default WorkspaceDialog
