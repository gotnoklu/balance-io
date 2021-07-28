import { createReduxAction } from '../../../utilities/storage/redux'
import { panelsReducerActions } from '../../../constants/storage'

const { SET_PANELS_STORE, ADD_PANEL, DELETE_PANEL, DELETE_ALL_PANELS, DELETE_MULTIPLE_PANELS } =
	panelsReducerActions

export const setPanelsStore = state => createReduxAction( SET_PANELS_STORE, state )

export const addPanel = panel => createReduxAction( ADD_PANEL, panel )

export const deletePanel = panelId => createReduxAction( DELETE_PANEL, panelId )

export const deleteAllPanels = () => createReduxAction( DELETE_ALL_PANELS )

export const deleteMultiplePanels = panelsList =>
	createReduxAction( DELETE_MULTIPLE_PANELS, panelsList )
