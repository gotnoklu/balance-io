import React from 'react'
import PropTypes from 'prop-types'
import Dialog from './Dialog'
import TextField from './TextField'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import EffectBox from './EffectBox'
import { times, taskTypes } from '../constants'
import { parseTimeStringFormat } from '../utilities/global'

const TaskDialog = ( { open, onClose, title, editDetails, onEdit, onSave } ) => {
	const [titleValue, setTitleValue] = React.useState( '' )
	const [descriptionValue, setDescriptionValue] = React.useState( '' )
	const [taskTypeValue, setTaskTypeValue] = React.useState( taskTypes.REGULAR )
	const [reminderFirstNotify, setReminderFirstNotify] = React.useState( times.t0s )
	const [selectedDate, setSelectedDate] = React.useState( new Date() )
	const [selectedTime, setSelectedTime] = React.useState( new Date() )

	React.useEffect( () => {
		const resetState = () => {
			setTitleValue( '' )
			setDescriptionValue( '' )
			setTaskTypeValue( taskTypes.REGULAR )
			setReminderFirstNotify( times.t0s )
			setSelectedDate( new Date() )
			setSelectedTime( new Date() )
		}

		const setState = () => {
			const dateTime = editDetails.reminder.expiresAt
				? new Date( editDetails.reminder.expiresAt )
				: new Date()
			setTitleValue( editDetails.title )
			setDescriptionValue( editDetails.description )
			setTaskTypeValue( editDetails.reminder ? taskTypes.REMINDER : taskTypes.REGULAR )
			setReminderFirstNotify(
				times[`t${editDetails.reminder ? editDetails.reminder.notifyBefore.short : '0s'}`]
			)
			setSelectedDate( dateTime )
			setSelectedTime( dateTime )
		}

		if ( !open ) {
			resetState()
		} else if ( open && editDetails ) {
			setState()
		}

		return () => {
			resetState()
		}
	}, [open] )

	const handleSaveDetails = () => {
		const getDate = () => selectedDate.toLocaleString().split( ',' )[0]
		const getTime = () => {
			const time = selectedTime.toLocaleString().split( ', ' )[1]
			const splitTime = time.split( /[:\s]/g )
			return `${splitTime[0]}:${splitTime[1]} ${splitTime[3]}`
		}

		if ( editDetails ) {
			switch ( taskTypeValue ) {
				case taskTypes.REGULAR:
					return onEdit( {
						id: editDetails.id,
						title: titleValue,
						description: descriptionValue,
						reminder: false,
					} )
				case taskTypes.REMINDER: {
					const expiresAt = selectedDate >= selectedTime ? selectedDate : selectedTime
					const parsedTime = parseTimeStringFormat()( reminderFirstNotify )
					expiresAt.setTime( selectedTime )
					expiresAt.setSeconds( 0 )
					return onEdit( {
						id: editDetails.id,
						title: titleValue,
						description: descriptionValue,
						reminder: {
							renderDate: getDate(),
							renderTime: getTime(),
							expiresAt: expiresAt,
							expired: new Date() >= new Date( expiresAt ),
							notifyBefore: {
								value: parsedTime.value,
								label: parsedTime.label,
								short: reminderFirstNotify,
							},
						},
					} )
				}
				default:
					break
			}
		}

		switch ( taskTypeValue ) {
			case taskTypes.REGULAR:
				return onSave( titleValue, descriptionValue, false, false )
			case taskTypes.REMINDER: {
				const greaterTime = selectedDate >= selectedTime ? selectedDate : selectedTime
				const parsedTime = parseTimeStringFormat()( reminderFirstNotify )
				greaterTime.setSeconds( 0 )
				return onSave(
					titleValue,
					descriptionValue,
					{
						renderDate: getDate(),
						renderTime: getTime(),
						expiresAt: greaterTime,
						notifyBefore: {
							value: parsedTime.value,
							label: parsedTime.label,
							short: reminderFirstNotify,
						},
					},
					false
				)
			}
			default:
				break
		}
	}

	const handleSetTitleValue = e => setTitleValue( e.target.value )

	const handleSetDescriptionValue = e => setDescriptionValue( e.target.value )

	const handleDateChange = date => setSelectedDate( date )

	const handleTimeChange = time => setSelectedTime( time )

	const handleSetTaskType = e => setTaskTypeValue( e.target.value )

	const handleSetReminderFirstNotify = e => setReminderFirstNotify( e.target.value )

	const dialogActions = [
		<Button key='cancel' onClick={onClose}>
			Cancel
		</Button>,
		<Button key='save' color='secondary' onClick={handleSaveDetails}>
			Save task
		</Button>,
	]

	return (
		<Dialog title={title} open={open} onClose={onClose} actions={dialogActions}>
			<Typography variant='h6' component='h4' color='textSecondary' gutterBottom>
				Task Details
			</Typography>
			<TextField
				name='title'
				variant='outlined'
				label='Task Title'
				placeholder='eg: Run five blocks'
				value={titleValue}
				onChange={handleSetTitleValue}
			/>
			<TextField
				name='description'
				variant='outlined'
				label='Task Description (optional)'
				placeholder='eg: Daily exercise routine'
				value={descriptionValue}
				onChange={handleSetDescriptionValue}
			/>
			<TextField
				select
				value={taskTypeValue}
				onChange={handleSetTaskType}
				variant='outlined'
				label='Task Type'
				margin='dense'>
				<MenuItem value={taskTypes.REGULAR}>Regular</MenuItem>
				<MenuItem value={taskTypes.REMINDER}>Reminder</MenuItem>
			</TextField>
			<EffectBox open={taskTypeValue === taskTypes.REMINDER} effect='collapse' unmountOnExit>
				<React.Fragment>
					<Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
					<Typography variant='h6' component='h4' color='textSecondary' gutterBottom>
						Reminder Date/Time
					</Typography>
					<Grid container spacing={1}>
						<Grid item xs={6}>
							<DatePicker value={selectedDate} onChange={handleDateChange} />
						</Grid>
						<Grid item xs={6}>
							<TimePicker value={selectedTime} onChange={handleTimeChange} />
						</Grid>
					</Grid>
					<TextField
						select
						value={reminderFirstNotify}
						onChange={handleSetReminderFirstNotify}
						variant='outlined'
						label='Show Notification'>
						<MenuItem value={times.t0s}>When due</MenuItem>
						<MenuItem value={times.t10m}>10 minutes before</MenuItem>
						<MenuItem value={times.t20m}>20 minutes before</MenuItem>
						<MenuItem value={times.t30m}>30 minutes before</MenuItem>
						<MenuItem value={times.t40m}>40 minutes before</MenuItem>
						<MenuItem value={times.t50m}>50 minutes before</MenuItem>
						<MenuItem value={times.t1h}>1 hour before</MenuItem>
						<MenuItem value={times.t2h}>2 hours before</MenuItem>
						<MenuItem value={times.t3h}>3 hours before</MenuItem>
					</TextField>
				</React.Fragment>
			</EffectBox>
		</Dialog>
	)
}

TaskDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	editDetails: PropTypes.object,
	onEdit: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
}

export default TaskDialog
