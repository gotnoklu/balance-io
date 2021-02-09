import 'date-fns'
import React from 'react'
import PropTypes from 'prop-types'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateIcon from '@material-ui/icons/CalendarToday'

function DatePicker({ value, onChange }) {
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<KeyboardDatePicker
				margin='dense'
				id='date-picker-dialog'
				label='Select Task Date'
				format='MM/dd/yyyy'
				inputVariant='outlined'
				value={value}
				onChange={onChange}
				KeyboardButtonProps={{
					'aria-label': 'change date',
				}}
				keyboardIcon={<DateIcon fontSize='small' color='secondary' />}
				leftArrowButtonProps={{ color: 'secondary' }}
				rightArrowButtonProps={{ color: 'secondary' }}
				allowKeyboardControl
			/>
		</MuiPickersUtilsProvider>
	)
}

DatePicker.propTypes = {
	value: PropTypes.any.isRequired,
	onChange: PropTypes.func.isRequired,
}

export default DatePicker
