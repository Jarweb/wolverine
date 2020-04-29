import { createModel } from '../../src/redux/createModel'

export default createModel({
	namespace: 'counter',
	state: {
		count: 0
	},
	reducers: {
		inc(state: any, { payload: count }: any) {
			return {
				...state,
				count: count
			}
		},
		dec(state: any, {payload: count}: any) {
			return {
				...state,
				count: count
			}		
		}
	},
})
