import React from 'react'
import Box from '@material-ui/core/Box'
import TaskBoardView from '../components/ui/TaskBoardView'
import { useDispatch } from 'react-redux'
import { getMainAppStore } from '../storage/electron-renderer'
import { setPanelStore, setBoardStore, setTaskStore } from '../storage/redux/actions'
import { getValueOfKey } from '../utilities/global'
import { storageKeys } from '../constants'

function HomePage() {
	const dispatch = useDispatch()

	React.useEffect( () => {
		const getInitialDataFromStorage = async () => {
			const storageResponse = await getMainAppStore()
			if ( storageResponse.success ) {
				dispatch( setBoardStore( getValueOfKey( storageResponse.data, storageKeys.BOARDS ) ) )
				dispatch( setPanelStore( getValueOfKey( storageResponse.data, storageKeys.PANELS ) ) )
				dispatch( setTaskStore( getValueOfKey( storageResponse.data, storageKeys.TASKS ) ) )
			}
		}

		getInitialDataFromStorage()
	}, [] )

	return (
		<Box width='100%' height='100%' component='section'>
			<TaskBoardView />
		</Box>
	)
}

export default HomePage
