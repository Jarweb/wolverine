import { createModel } from '../../src/redux/createModel'

export default createModel({
	namespace: 'demo',
	state: {
		light: false
	},
	reducers: {
		toggle(state: any, { payload: doToggle }: any) {
			return {
				...state,
				light: doToggle
			}
		},
	},
})