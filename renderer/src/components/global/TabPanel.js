import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const TabPanel = ( { tabIndex, tabPanelIndex, children, ...other } ) => (
	<div
		role='tabpanel'
		hidden={tabIndex !== tabPanelIndex}
		id={`tabpanel-${tabPanelIndex}`}
		aria-labelledby={`tab-${tabPanelIndex}`}
		{...other}>
		{tabIndex === tabPanelIndex && (
			<Box>
				<Typography>{children}</Typography>
			</Box>
		)}
	</div>
)

TabPanel.propTypes = {
	children: PropTypes.node,
	tabPanelIndex: PropTypes.number.isRequired,
	tabIndex: PropTypes.number.isRequired,
}

export default TabPanel
