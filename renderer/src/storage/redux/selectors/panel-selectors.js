export const getPanelStore = state => state.panels

export const getPanelsByBoard = board => state => {
	const panelStore = getPanelStore( state ).panels
	return panelStore.filter( panel => panel.board === board )
}
