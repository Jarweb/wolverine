import { useSelector, useDispatch } from 'react-redux'

export default function useController (props: any) {
	const dispatch = useDispatch()
	const { count } = useSelector((store) => {
		const { counter } = store as any

		return {
			count: counter.count
		}
	})

	const onInc = () => {
		dispatch({
			type: 'counter/inc',
			payload: count + 1
		})
	}

	const onDec = () => {
		dispatch({
			type: 'counter/dec',
			payload: count - 1
		})
	}

	return {
		count,
		onInc,
		onDec,
	}
}