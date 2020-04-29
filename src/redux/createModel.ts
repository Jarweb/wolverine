
interface Model {
	namespace: string,
	state: any,
	reducers: any
}

export const createModel = (model: Model) => {
	const { namespace, state: initialState, reducers } = model
	const finalActionType: {[key: string]: string} = {}

	Object.keys(reducers).forEach((item) => {
		finalActionType[`${namespace}/${item}`] = `${item}`
	})
	
	const finalReducers = (state = initialState, action: any) => {
		const type = finalActionType[action.type]

		return type
			? reducers[type](state, { payload: action.payload })
			: state
	}

	return finalReducers
}