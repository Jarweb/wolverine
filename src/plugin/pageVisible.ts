
type PageVisible = 'hidden' | 'visible'

export default function pageVisibleMiddleware(ctx: any) {
	const handler = () => {
		// 最小化，后台，息屏，unload，tab 切换
		const visible: PageVisible = document.visibilityState 
		ctx.emit('pageVisible', visible)
	}

	document.addEventListener('visibilitychange', handler)
	return () => {
		window.removeEventListener('visibilitychange', handler)
	}
}