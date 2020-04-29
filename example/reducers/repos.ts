import { createModel } from '../../src/redux/createModel'

export default createModel({
	namespace: 'repos',
	state: {
		lists: []
	},
	reducers: {
		remove(state: any, action: any) {
			return {
				...state,
				lists: state.lists.filter((i: any) => i.id !== action.payload)
			}
		},
		push(state: any, {payload: list}: any) {
			return {
				...state,
				lists: [...state.lists, ...list]
			}
		}
	},
})