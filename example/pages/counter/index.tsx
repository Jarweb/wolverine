import React from 'react'
import {Link} from 'react-router-dom'
import useController from './controller'
import Repo from '../repo'
import Item from './components/item'

export default React.memo((props: any) => {
	const {
		count,
		onDec,
		onInc
	} = useController(props)

	return (
		<div>
			<div>home: <Link to="/">home</Link></div>
			counter
			<div>{count}</div>
			<div><button onClick={onInc}>inc</button></div>
			<div><button onClick={onDec}>dec</button></div>
			<div>
				<Item />
			</div>
			<div>
				<Repo />
			</div>
		</div>
	)
})