interface ConnectionInfo {
	status: 'online' | 'offline',
	effectiveType: string
	rtt: number,
	downlink: number,
	saveData: boolean,
}

export default function networkChange(ctx: any) {
	const updateOnlineStatus = () => {
		const condition = navigator.onLine ? "online" : "offline"
		const { effectiveType, rtt, downlink, saveData } = navigator.connection

		ctx.connection = {
			status: condition,
			effectiveType,
			rtt,
			downlink,
			saveData
		} as ConnectionInfo

		// todo，show notice bar
	}

	window.addEventListener('load', () => {
		window.addEventListener('online', updateOnlineStatus)
		window.addEventListener('offline', updateOnlineStatus)
		navigator.connection &&
			navigator.connection.addEventListener('change', updateOnlineStatus)
	})
	
	window.addEventListener('beforeunload', () => {
		window.removeEventListener('online', updateOnlineStatus)
		window.removeEventListener('offline', updateOnlineStatus)
		navigator.connection &&
			navigator.connection.removeEventListener('change', updateOnlineStatus)
	})
}