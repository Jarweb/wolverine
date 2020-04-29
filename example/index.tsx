import Wolverine from '../src'
import routes from './routers'
import reducers from './reducers'
import networkChangePlugin from './plugins/networkChange'

const app = new Wolverine({
	appMode: 'spa',
	routerMode: 'hashRouter'
})

app.configReducers(reducers)
app.configRoutes(routes)

// catch components error
app.onError((error, ctx) => {
	console.log('app error', error)
})

// app didmount
app.onDidmount((ctx) => {
	console.log('app didmount', ctx)

	const handle = (state: any) => {
		console.log('route change', state)
	}
	const clean = ctx.on('routeChange', handle)

	return () => {
		clean()
	}
})

// app unmount
app.onUnmount((ctx) => {
	console.log('app unmount', ctx)
})

// add plugins: sync/async
app.use((ctx) => {
	return new Promise((resolve, reject) => {
		return import(
			/* webpackChunkName: 'report' */
			'./plugins/sdkreport'
		).then(({ default: report }) => {
			setTimeout(() => {
				ctx.reportsdk = report
				console.log('report', ctx)
				resolve(() => {
					console.log('clean report')
				})
			}, 10000);
		})
	})
})

app.use((ctx) => {
	return import(
		/* webpackChunkName: 'absdk' */
		'./plugins/sdkab'
	).then(({ default: ab }) => {
		ctx.absdk = ab
		return () => {
			console.log('clean absdk')
		}
	})
})

app.use(networkChangePlugin)

app.render(document.getElementById('root'))
