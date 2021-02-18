import { createReduxAction } from './creators'
import { SET_PANEL_STORE, ADD_PANEL, REMOVE_PANEL, REMOVE_ALL_PANELS } from './types'

export const setPanelStore = state => createReduxAction( SET_PANEL_STORE, state )

export const addPanel = panel => createReduxAction( ADD_PANEL, panel )

export const removePanel = id => createReduxAction( REMOVE_PANEL, id )

export const removeAllPanels = () => createReduxAction( REMOVE_ALL_PANELS )
