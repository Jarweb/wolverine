
// 2 个通知时机。订阅时通知，数据更新时通知

class Observable {
	observers: any[] = []
	store: any = {}

	// 需要先订阅
	public add (observer: any) {
		this.observers.push(observer)
		this.notify()
	}

	public remove (observer: any) {
		const index = this.observers.indexOf(observer)
		if (index > -1) {
			this.observers.splice(index, 1)
		}
	}

	public clear () {
		this.observers = []
		this.store = {}
	}

	public notify () {
		this.observers.forEach(item => {
			item.update()
		})
	}

	// 数据更新时，通知所有的订阅方
	public updateStore (store: any) {
		this.store = store
		this.notify()
	}

	public getStore () {
		return this.store
	}
}

export default new Observable()