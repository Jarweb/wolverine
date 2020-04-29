import { createStore, combineReducers, ReducersMapObject } from 'redux'
import app from './appReducer'

export default function configReducers<S>(reducers: ReducersMapObject<S, any>) {
	return createStore(combineReducers({ app, ...reducers}))
} 
