import React from 'react'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import WorkspaceIcon from '@material-ui/icons/Work'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentBoardId } from '../../storage/redux/actions'
import { getBoardsStore } from '../../storage/redux/selectors'
import TextField from './TextField'

const useStyles = makeStyles( theme => ( {
	appBar: {
		top: '30px',
		background: 'none',
		transition: theme.transitions.create( ['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		} ),
	},
	marginRight: {
		marginRight: theme.spacing( 2 ),
	},
	appIcon: {
		marginRight: theme.spacing( 2 ),
	},
} ) )

const AppBar = ( { onWorkspaceDialogOpen, onSettingsDialogOpen } ) => {
	const classes = useStyles()
	const dispatch = useDispatch()

	const { boards_list, current_board_id } = useSelector( getBoardsStore )

	const handleBoardSelect = async event => {
		await dispatch( setCurrentBoardId( event.target.value ) )
	}

	return (
		<MuiAppBar position='fixed' className={classes.appBar}>
			<Toolbar>
				<Box width='100%'>
					<Box display='flex' alignItems='center'>
						{/* <img
							className={classes.appIcon}
							src='/images/balance-32x32.png'
							width='32'
							height='32'
						/> */}
						<Box className={classes.marginRight} display='flex' flexDirection='column' flexGrow={1}>
							{boards_list.length > 0 && (
								<TextField
									select
									value={current_board_id ? current_board_id : ''}
									onChange={handleBoardSelect}
									variant='outlined'
									label='Select board'>
									{boards_list.map( ( { id, name } ) => (
										<MenuItem value={id} key={id}>
											<Typography
												variant='h6'
												component='h3'
												color={current_board_id === id ? 'secondary' : 'textPrimary'}>
												{name}
											</Typography>
										</MenuItem>
									) )}
								</TextField>
							)}
						</Box>
						<IconButton
							className={classes.marginRight}
							color='secondary'
							aria-label='manage boards and panels'
							edge='end'
							onClick={onWorkspaceDialogOpen}>
							<WorkspaceIcon fontSize='small' />
						</IconButton>
						<IconButton aria-label='open settings' edge='end' onClick={onSettingsDialogOpen}>
							<SettingsIcon fontSize='small' />
						</IconButton>
					</Box>
				</Box>
			</Toolbar>
		</MuiAppBar>
	)
}

AppBar.propTypes = {
	onWorkspaceDialogOpen: PropTypes.func.isRequired,
	onSettingsDialogOpen: PropTypes.func.isRequired,
}

export default AppBar
