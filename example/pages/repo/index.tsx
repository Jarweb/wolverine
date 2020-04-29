import React from 'react'
import { Link } from 'react-router-dom'
import useController from './controller'

export default (props: any) => {
	const { 
		loading, 
		onFetch, 
		lists, 
		handleClick, 
		handleToggle, 
		light 
	} = useController(props)

	return (
		<div>
			<div>home: <Link to="/">home</Link></div>
			<div>
				light: {light ? 'on' : 'off'}
				<button onClick={handleToggle}>toggle</button>
			</div>
			<div>
				<button onClick={handleClick}>click</button>
			</div>
			repo
			<div>{loading ? 'loading' : 'done'}</div>
			<div><button onClick={onFetch}>click</button></div>
			<div>
				{lists.map((item: any,index: number) => (
					<div key={item.name + index}>{item.name}</div>
				))}
			</div>
		</div>
	)
}