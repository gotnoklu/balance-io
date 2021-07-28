import React from 'react'
import PropTypes from 'prop-types'
import MuiTabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const a11yProps = index => ( {
	id: `tab-${index}`,
	'aria-controls': `tabpanel-${index}`,
} )

const Tabs = ( { tabs, currentTabIndex, onChange, ariaLabel } ) => {
	return (
		<Box>
			<MuiTabs
				variant='fullWidth'
				value={currentTabIndex}
				onChange={onChange}
				aria-label={ariaLabel}>
				{tabs.map( ( { index, label } ) => (
					<Tab
						key={index}
						tabIndex={index}
						label={<Typography variant='h6'>{label}</Typography>}
						{...a11yProps( index )}
					/>
				) )}
			</MuiTabs>
		</Box>
	)
}

Tabs.propTypes = {
	tabs: PropTypes.array.isRequired,
	currentTabIndex: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	ariaLabel: PropTypes.string.isRequired,
}

export default Tabs
