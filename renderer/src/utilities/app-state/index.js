import { useState, useEffect, useCallback, useRef } from 'react'

const useStateWithUpdate = (initialState) => {
	const [state, setState] = useState(initialState)
	const resolverRef = useRef(null)

	useEffect(() => {
		if (resolverRef.current) {
			resolverRef.current(state)
			resolverRef.current = null
		}
	}, [resolverRef.current, state])

	const updateState = useCallback(
		(update) => {
			setState(update)
			return new Promise((resolve) => {
				resolverRef.current = resolve
			})
		},
		[setState]
	)

	return [state, updateState]
}

export { useStateWithUpdate }
