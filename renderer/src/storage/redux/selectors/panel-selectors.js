export const getPanelStore = state => state.panels

export const getPanelsByBoard = board => state => {
	const panels = getPanelStore( state ).panels
	return panels.filter( panel => panel.board === board )
}
