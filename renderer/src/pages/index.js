import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Router from 'next/router'
import { Avatar, Typography, CircularProgress } from '@material-ui/core'
import { getMainAppStore, backupMainAppStore } from '../utilities/store/electron-renderer'
import { useDispatch } from 'react-redux'
import { setAppStore, setTasksStore } from '../utilities/store/redux/actions'

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100vh',
		overflowY: 'hidden',
	},
	main: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatar: {
		width: '100px',
		height: '100px',
		marginBottom: '40px',
	},
	margin: {
		marginBottom: '24px',
	},
}))

function SplashPage() {
	const [isStoreBackedUp, setIsStoreBackedUp] = React.useState(false)
	const classes = useStyles()
	const dispatch = useDispatch()

	React.useEffect(() => {
		const initAppStore = async () => {
			const mainAppStoreResponse = await getMainAppStore()
			if (mainAppStoreResponse.success) {
				const backupResponse = await backupMainAppStore()
				if (backupResponse.success) {
					setIsStoreBackedUp(backupResponse.success)
					dispatch(setAppStore(mainAppStoreResponse.data.app))
					dispatch(setTasksStore(mainAppStoreResponse.data.tasks))
				}
			}
		}
		initAppStore()
	}, [])

	React.useEffect(() => {
		const { pathname } = Router
		if (isStoreBackedUp && (pathname === '/index' || pathname === '/')) {
			Router.push('/home')
		}
	}, [isStoreBackedUp])

	return (
		<div className={classes.root}>
			<main className={classes.main}>
				<Avatar className={classes.avatar} src='/images/iris.png' />
				<Typography variant='h1' component='h1' gutterBottom>
					Iris
				</Typography>
				<Typography className={classes.margin} component='h2' variant='body1' gutterBottom>
					Preparing your tasks...
				</Typography>
				<CircularProgress variant='indeterminate' color='secondary' size='24px' />
			</main>
		</div>
	)
}

export default SplashPage
