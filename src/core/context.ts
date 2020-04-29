import EventEmitter from '../utils/event'

export let appContext: any = {}
export const appContextEvent = new EventEmitter()

appContextEvent.on('_ctx_change_', (ctx: any) => {
	appContext = ctx
})