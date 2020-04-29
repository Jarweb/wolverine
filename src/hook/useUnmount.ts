import {useEffect, useRef} from 'react'

export default function useUnmount (cleanup: () => void) {
	const ref = useRef(cleanup)
	
	useEffect(() => {
		const clean = ref.current
		
		return () => {
			clean()
		}
	}, [])
}