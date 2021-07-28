import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import DarkThemeIcon from '@material-ui/icons/Brightness2Rounded'
import TabPanel from './TabPanel'

const BoardsTabPanel = ( { tabIndex, tabPanelIndex } ) => {
	return (
		<TabPanel tabIndex={tabIndex} tabPanelIndex={tabPanelIndex}>
			<List component='ul' disablePadding>
				<ListItem>
					<ListItemIcon>
						<DarkThemeIcon fontSize='small' color='secondary' />
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography component='p' color='textPrimary'>
								Dark theme
							</Typography>
						}
					/>
					<ListItemSecondaryAction>
						{/* <Switch
							color='secondary'
							checked={themeType === DARK}
							value='dark theme'
							onChange={onThemeToggle}
						/> */}
					</ListItemSecondaryAction>
				</ListItem>
			</List>
		</TabPanel>
	)
}

BoardsTabPanel.propTypes = {
	tabIndex: PropTypes.number.isRequired,
	tabPanelIndex: PropTypes.number.isRequired,
}

export default BoardsTabPanel
