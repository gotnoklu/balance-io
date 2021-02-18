import React from 'react'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Box from '@material-ui/core/Box'
import PanelsIcon from '@material-ui/icons/ViewWeekRounded'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckBoxBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import DateIcon from '@material-ui/icons/CalendarToday'
import TimeIcon from '@material-ui/icons/Timer'
import { useSelector } from 'react-redux'
import { getCurrentBoard, getPanelsByBoard } from '../../storage/redux/selectors'

const useStyles = makeStyles( theme => ( {
	taskCard: {
		height: '100%',
		position: 'relative',
		backgroundColor: theme.palette.primary.main,
	},
	cardContent: {
		height: '100%',
		marginBottom: theme.spacing( 5 ),
	},
	cardActions: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
	},
	alignRight: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
	},
	hideRest: ( { expanded } ) => ( {
		overflow: expanded ? 'initial' : 'hidden',
		textOverflow: 'ellipsis',
	} ),
	chipLabel: ( { strikeThrough } ) => ( {
		textDecoration: strikeThrough ? 'line-through' : 'unset',
	} ),
} ) )

const ChipLabel = ( { text, strikeThrough } ) => {
	const classes = useStyles( { strikeThrough } )
	return (
		<Box className={classes.chipLabel}>
			<Typography variant='body2' component='span'>
				{text}
			</Typography>
		</Box>
	)
}

ChipLabel.propTypes = { text: PropTypes.string, strikeThrough: PropTypes.bool }

const TaskCard = ( {
	id,
	name,
	description,
	reminder,
	panel,
	selectionStarted,
	onPanelChange,
	onSelect,
	onEdit,
	onDelete,
	selected,
} ) => {
	const [isSelected, setIsSelected] = React.useState( false )
	const [expanded, setExpanded] = React.useState( false )
	const [anchorEl, setAnchorEl] = React.useState( false )

	const classes = useStyles( { expanded } )

	const currentBoard = useSelector( getCurrentBoard )
	const panels = useSelector( getPanelsByBoard( currentBoard ) )
	const filteredPanels = panels.filter( value => value.id !== panel )

	const handleOpenMenu = e => setAnchorEl( e.currentTarget )

	const handleCloseMenu = () => setAnchorEl( null )

	const handleMenuItemClick = e => {
		onPanelChange( e.currentTarget.dataset.value, id )
		handleCloseMenu()
	}

	const handleEdit = () => onEdit( { id, name, description, reminder } )

	const handleDelete = () => onDelete( id )

	const handleToggleSelection = () => {
		if ( onSelect ) {
			onSelect( id, isSelected )
		}
		setIsSelected( !isSelected )
	}

	React.useEffect( () => {
		setIsSelected( selected )
	}, [selected] )

	const handleExpand = () => {
		setExpanded( !expanded )
	}

	return (
		<Card variant='outlined' className={classes.taskCard}>
			<CardContent className={classes.cardContent} onClick={handleExpand}>
				<div className={classes.hideRest}>
					<Typography variant='h5' component='span' noWrap={!expanded} gutterBottom>
						{name || 'No name'}
					</Typography>
				</div>
				<div className={classes.hideRest}>
					<Typography color='textSecondary' noWrap={!expanded} gutterBottom>
						{description || 'No description'}
					</Typography>
				</div>
				{reminder && (
					<Box marginTop={1}>
						<Chip
							color='secondary'
							icon={<DateIcon fontSize='small' color='secondary' />}
							label={<ChipLabel text={reminder.renderDate} strikeThrough={reminder.expired} />}
							size='small'
							variant={reminder.expired ? 'outlined' : 'default'}
						/>
						<Chip
							color='secondary'
							icon={<TimeIcon fontSize='small' color='secondary' />}
							label={<ChipLabel text={reminder.renderTime} strikeThrough={reminder.expired} />}
							style={{ marginLeft: '8px' }}
							size='small'
							variant={reminder.expired ? 'outlined' : 'default'}
						/>
					</Box>
				)}
			</CardContent>
			<CardActions className={classes.cardActions}>
				{selectionStarted && (
					<IconButton color='primary' onClick={handleToggleSelection}>
						{isSelected ? (
							<CheckBoxIcon color='secondary' fontSize='small' />
						) : (
							<CheckBoxBlankIcon color='secondary' fontSize='small' />
						)}
					</IconButton>
				)}
				<div className={classes.alignRight}>
					<IconButton onClick={handleDelete}>
						<DeleteIcon fontSize='small' color='error' />
					</IconButton>
					<IconButton color='secondary' onClick={handleEdit}>
						<EditIcon fontSize='small' />
					</IconButton>
					{( !reminder || reminder.expired ) && (
						<IconButton color='secondary' onClick={handleOpenMenu}>
							<PanelsIcon fontSize='small' />
						</IconButton>
					)}
					<Menu
						open={Boolean( anchorEl )}
						anchorEl={anchorEl}
						onBackdropClick={handleCloseMenu}
						onClose={handleCloseMenu}>
						{filteredPanels.map( option => (
							<MenuItem
								data-value={option.id}
								className={classes.menuItem}
								onClick={handleMenuItemClick}
								key={option.id}>
								<ListItemIcon>
									<PanelsIcon color='secondary' />
								</ListItemIcon>
								<ListItemText primary={option.name} />
							</MenuItem>
						) )}
					</Menu>
				</div>
			</CardActions>
		</Card>
	)
}

TaskCard.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	panel: PropTypes.string.isRequired,
	reminder: PropTypes.oneOfType( [PropTypes.bool, PropTypes.object] ),
	onPanelChange: PropTypes.func,
	selectionStarted: PropTypes.bool,
	onSelect: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	selected: PropTypes.bool,
}

export default TaskCard
