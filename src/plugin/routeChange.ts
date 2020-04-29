import { LocationState } from 'history'

interface HistoryState {
	pathname: string,
	search: string,
	hash: string,
	state: LocationState
}

export default function routeChangeMiddleware(ctx: any) {
	const handler = (state: HistoryState) => {
		ctx.emit('routeChange', state)
	}
	const clean = ctx.history.listen(handler)

	return () => {
		clean()
	}
}