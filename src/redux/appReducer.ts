import {createModel} from './createModel'

export default createModel({
	namespace: 'app',
	state: {
		msg: 'hi'
	},
	reducers: {
		say(state: any, {payload}: any){
			return {
				...state
			}
		}
	}
})