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
import { durations, taskTypes } from '../../constants'
import { parseTimeStringFormat } from '../../utilities/global'

const TaskDialog = ( { open, onClose, title, editDetails, onEdit, onSave } ) => {
	const [name, setName] = React.useState( '' )
	const [description, setDescription] = React.useState( '' )
	const [taskType, setTaskType] = React.useState( taskTypes.REGULAR )
	const [firstNotifyTime, setFirstNotifyTime] = React.useState( durations.t0s )
	const [selectedDate, setSelectedDate] = React.useState( new Date() )
	const [selectedTime, setSelectedTime] = React.useState( new Date() )

	React.useEffect( () => {
		const resetState = () => {
			setName( '' )
			setDescription( '' )
			setTaskType( taskTypes.REGULAR )
			setFirstNotifyTime( durations.t0s )
			setSelectedDate( new Date() )
			setSelectedTime( new Date() )
		}

		const setState = () => {
			const dateTime = editDetails.reminder.expiresAt
				? new Date( editDetails.reminder.expiresAt )
				: new Date()
			setName( editDetails.name )
			setDescription( editDetails.description )
			setTaskType( editDetails.reminder ? taskTypes.REMINDER : taskTypes.REGULAR )
			setFirstNotifyTime(
				durations[`t${editDetails.reminder ? editDetails.reminder.notifyBefore.short : '0s'}`]
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
		const createTaskTypeDetails = ( type, details ) => {
			const getDate = () => selectedDate.toLocaleString().split( ',' )[0]
			const getTime = () => {
				const time = selectedTime.toLocaleString().split( ', ' )[1]
				const splitTime = time.split( /[:\s]/g )
				return `${splitTime[0]}:${splitTime[1]} ${splitTime[3]}`
			}

			const id = ( details && details.id ) || null
			const completed = ( details && details.completed ) || false
			const baseTemplate = { id, name, description, completed, reminder: false }

			switch ( type ) {
				case taskTypes.REGULAR:
					return baseTemplate
				case taskTypes.REMINDER: {
					const expiresAt = selectedDate >= selectedTime ? selectedDate : selectedTime
					const parsedTime = parseTimeStringFormat()( firstNotifyTime )
					expiresAt.setTime( selectedTime )
					expiresAt.setSeconds( 0 )
					baseTemplate.reminder = {
						renderDate: getDate(),
						renderTime: getTime(),
						expiresAt: expiresAt,
						expired: new Date() >= new Date( expiresAt ),
						notifyBefore: {
							value: parsedTime.value,
							label: parsedTime.label,
							short: firstNotifyTime,
						},
					}
					return baseTemplate
				}
				default:
					break
			}
		}

		if ( editDetails ) {
			const editResult = createTaskTypeDetails( taskType, editDetails )
			return onEdit( editResult )
		}

		return onSave( createTaskTypeDetails( taskType ) )
	}

	const handleSetName = e => setName( e.target.value )

	const handleSetDescription = e => setDescription( e.target.value )

	const handleDateChange = date => setSelectedDate( date )

	const handleTimeChange = time => setSelectedTime( time )

	const handleSetTaskType = e => setTaskType( e.target.value )

	const handleSetReminderFirstNotify = e => setFirstNotifyTime( e.target.value )

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
				name='name'
				variant='outlined'
				label='Task Name'
				placeholder='eg: Run five blocks'
				value={name}
				onChange={handleSetName}
			/>
			<TextField
				name='description'
				variant='outlined'
				label='Task Description (optional)'
				placeholder='eg: Daily exercise routine'
				value={description}
				onChange={handleSetDescription}
			/>
			<TextField
				select
				value={taskType}
				onChange={handleSetTaskType}
				variant='outlined'
				label='Task Type'
				margin='dense'>
				<MenuItem value={taskTypes.REGULAR}>Regular</MenuItem>
				<MenuItem value={taskTypes.REMINDER}>Reminder</MenuItem>
			</TextField>
			<EffectBox open={taskType === taskTypes.REMINDER} effect='collapse' unmountOnExit>
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
						value={firstNotifyTime}
						onChange={handleSetReminderFirstNotify}
						variant='outlined'
						label='Show Notification'>
						<MenuItem value={durations.t0s}>When due</MenuItem>
						<MenuItem value={durations.t10m}>10 minutes before</MenuItem>
						<MenuItem value={durations.t20m}>20 minutes before</MenuItem>
						<MenuItem value={durations.t30m}>30 minutes before</MenuItem>
						<MenuItem value={durations.t40m}>40 minutes before</MenuItem>
						<MenuItem value={durations.t50m}>50 minutes before</MenuItem>
						<MenuItem value={durations.t1h}>1 hour before</MenuItem>
						<MenuItem value={durations.t2h}>2 hours before</MenuItem>
						<MenuItem value={durations.t3h}>3 hours before</MenuItem>
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
