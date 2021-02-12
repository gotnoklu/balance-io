import 'date-fns'
import React from 'react'
import PropTypes from 'prop-types'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers'
import ClockIcon from '@material-ui/icons/Timer'

function TimePicker( { value, onChange } ) {
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<KeyboardTimePicker
				margin='dense'
				id='time-picker'
				label='Select Task Time'
				inputVariant='outlined'
				value={value}
				onChange={onChange}
				KeyboardButtonProps={{
					'aria-label': 'change time',
				}}
				keyboardIcon={<ClockIcon fontSize='small' color='secondary' />}
				leftArrowButtonProps={{ color: 'secondary' }}
				rightArrowButtonProps={{ color: 'secondary' }}
				allowKeyboardControl
			/>
		</MuiPickersUtilsProvider>
	)
}

TimePicker.propTypes = {
	value: PropTypes.any.isRequired,
	onChange: PropTypes.func.isRequired,
}

export default TimePicker
