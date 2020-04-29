import React, { Suspense, ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { createHashHistory, createBrowserHistory, History } from 'history'
import { ReducersMapObject } from 'redux'
import { Provider } from 'react-redux'
import ErrorBoundary from './ErrorBoundle'
import EventEmitter from '../utils/event'
import configReducers from '../redux/store'
import useUnmount from '../hook/useUnmount'
import { appContextEvent } from './context'
import pageVisibleMiddleware from '../plugin/pageVisible'
import routeChangeMiddleware from '../plugin/routeChange'

interface AppConfig {
	appMode: 'spa' | 'mpa',
	routerMode: 'hashRouter' | 'historyRouter'
	pageLoading?: NonNullable<ReactNode> | null,
	pageNotFound?: React.ReactNode,
	pageForbidden?: React.ReactNode,
	pageNetworkError?: React.ReactNode,
	pageServerError?: React.ReactNode,
}

type Plugin = (ctx: any) => void

interface AppLifeCycle {
	pageError: (error: any) => void,
	pageDidmount: (ctx: any) => void | (() => void),
	pageUnmount: (ctx: any) => void,
}

class Application extends EventEmitter {
	private plugins: Plugin[] = []
	private pluginsReady: string[] = []
	private pluginCleanup: Function[] = []
	private routersMap = []
	private history: History | null = null
	private reducers: ReducersMapObject = {}
	private ctx: any = {}
	private appConfig: AppConfig = {
		appMode: 'spa',
		routerMode: 'hashRouter'
	}

	private appLifeCycle: AppLifeCycle = {
		pageError: (error: any) => {},
		pageDidmount: (ctx: any) => {},
		pageUnmount: (ctx: any) => {},
	}

	public constructor(options?: AppConfig) {
		super()
		this.configApp(options)
		this.plugins.push(...[
			pageVisibleMiddleware,
			routeChangeMiddleware
		])
	}

	public configApp = (options?: AppConfig) => {
		this.appConfig = {
			...this.appConfig,
			...options
		}
	}

	public configRoutes = (routesMap: any) => {
		this.routersMap = routesMap
	}

	private createHistory = () => {
		if (this.appConfig.routerMode === 'historyRouter') {
			return createBrowserHistory()
		}
		if (this.appConfig.routerMode === 'hashRouter') {
			return createHashHistory()
		}
		throw new Error('routerMode error')
	}

	public configReducers = (reducers: ReducersMapObject) => {
		this.reducers = reducers
	}

	public use = (cb: Plugin) => {
		this.plugins.push(cb)
	}

	public pluginReady = (name: string) => {
		return new Promise((resolve, reject) => {
			if (this.ctx[name]) {
				this.pluginsReady.push(name)
				resolve(this.ctx[name])
			}
			else {
				if (this.pluginsReady.indexOf(name) === -1) {
					appContextEvent.on('_ctx_change_', (ctx: any) => {
						ctx[name] && resolve(ctx[name])
					})
					this.pluginsReady.push(name)
				}
			}
		})
	}

	private renderSpa = () => {
		if (this.history === null) return null;

		return (
			<Router history={this.history}>
				<Suspense fallback={this.appConfig.pageLoading || null}>
					<Switch>
						{this.routersMap.map(({ ...props }: any, index: number) => (
							<Route
								{...props}
								component={props.component}
								key={(props.path + index) as string}
							/>
						))}
						<Redirect from="*" to="/404" />
					</Switch>
				</Suspense>
			</Router>
		)
	}

	private renderApp = (App?: () => JSX.Element) => {
		const InnerApp: () => JSX.Element | null = this.appConfig.appMode === 'spa'
			? App ? App : this.renderSpa
			: () => null

		return () => {
			useEffect(() => {
				const clean = this.appLifeCycle.pageDidmount(this.ctx)
				
				return () => {
					clean && clean()
				}
			}, [])

			useUnmount(() => {
				this.off('_error', this.appLifeCycle.pageError)
				this.pluginCleanup.forEach(item => {
					item()
				})
				this.appLifeCycle.pageUnmount(this.ctx)
			})

			return (
				<ErrorBoundary onCatch={this.catchComponentError}>
					<InnerApp />
				</ErrorBoundary>
			)
		}
	}

	public render = (root: HTMLElement | null, App?: () => JSX.Element) => {
		if (!root) return

		// bind event emitter
		this.ctx.emit = this.emit.bind(this)
		this.ctx.on = this.on.bind(this)
		this.ctx.once = this.once.bind(this)
		this.ctx.off = this.off.bind(this)
		appContextEvent.emit('_ctx_change_', this.ctx)

		// config history, store
		this.history = this.createHistory()
		const store = configReducers(this.reducers)

		// bind ctx
		this.ctx.routersMap = this.routersMap
		this.ctx.appConfig = this.appConfig
		this.ctx.history = this.history
		this.ctx.plugins = this.plugins
		this.ctx.ready = this.pluginReady
		
		// excute plugins
		this.plugins.forEach(async (item: Plugin) => {
			try {
				const clean = await item(this.ctx)

				typeof clean === 'function' 
					&& this.pluginCleanup.push(clean as unknown as Function)

				appContextEvent.emit('_ctx_change_', this.ctx)
			} catch (error) {
				throw error
			}
		})

		// app lifecycle
		const InnerApp = this.renderApp(App)

		ReactDOM.render(
			<React.StrictMode>
				<Provider store={store}>
					<InnerApp />
				</Provider>
			</React.StrictMode>
			, root
		)
	}

	public catchComponentError = (err: Error) => {
		this.emit('_error', err)
	}

	public onError = (cb: (error: Error, ctx: any) => void) => {
		this.appLifeCycle.pageError = (err: any) => {
			cb(err, this.ctx)
		}
		this.on('_error', this.appLifeCycle.pageError)
	}

	public onDidmount = (cb: (ctx: any) => void | (() => void)) => {
		this.appLifeCycle.pageDidmount = cb
	}

	public onUnmount = (cb: (ctx: any) => void) => {
		this.appLifeCycle.pageUnmount = cb
	}
}

export default Application