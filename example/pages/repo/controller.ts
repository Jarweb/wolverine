import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRepos } from '../../servers/index';
import { appContext }  from '../../../src'

export default function useController(props: any) {
	const [loading, setLoading] = useState(false)
	const dispatch = useDispatch()
	const { lists, light } = useSelector((store) => {
		const { repos, demo } = store as any
		console.log(store)
		return {
			lists: repos.lists,
			light: demo.light
		}
	})

	const handleToggle = () => {
		dispatch({
			type: 'demo/toggle',
			payload: !light
		})
	}

	const handleClick = () => {
		appContext.ready('reportsdk')
			.then((reportsdk: any) => {
				reportsdk.push()
			})
	}

	const onFetch = async () => {
		setLoading(true)

		const res = await getRepos('Jarweb')
		.finally(() => {
			setLoading(false)
		})

		dispatch({
			type: 'repos/push',
			payload: res as any
		})
	}

	useEffect(() => {
		const handle = (visiable: any) => {
			console.log(visiable)
		}
		const clean = appContext.on('pageVisible', handle)

		return () => {
			clean()
		}
	}, [])

	return {
		light,
		handleToggle,

		loading,
		lists,
		onFetch,
		handleClick,
	}
}