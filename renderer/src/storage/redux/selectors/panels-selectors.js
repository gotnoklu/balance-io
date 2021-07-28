export const getPanelsStore = state => state.panels

export const getPanelsByBoardId = board_id => state => {
	const panels = getPanelsStore( state ).panels
	return panels.filter( panel => panel.board_id === board_id )
}
