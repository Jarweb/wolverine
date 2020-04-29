import React from 'react'

export default React.memo(() => {
	console.log('render item')
	return (
		<div>count child</div>
	)
})