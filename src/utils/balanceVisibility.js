// 余额可见性状态管理
class BalanceVisibilityManager {
    constructor() {
        this.storageKey = 'balanceVisibility'
        this.defaultValue = true
        this.listeners = []
    }

    // 获取当前状态
    getVisibility() {
        try {
            const stored = localStorage.getItem(this.storageKey)
            const result = stored !== null ? JSON.parse(stored) : this.defaultValue
            return result
        } catch (error) {
            return this.defaultValue
        }
    }

    setVisibility(isVisible) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(isVisible))
            this.notifyListeners(isVisible)
            return true
        } catch (error) {
            return false
        }
    }

    // 切换状态
    toggleVisibility() {
        const currentState = this.getVisibility()
        const newState = !currentState
        this.setVisibility(newState)
        console.log('切换余额可见性状态:', currentState, '->', newState)
        return newState
    }

    addListener(callback) {
        this.listeners.push(callback)
    }

    removeListener(callback) {
        const index = this.listeners.indexOf(callback)
        if (index > -1) {
            this.listeners.splice(index, 1)
        }
    }

    notifyListeners(newState) {
        this.listeners.forEach(callback => {
            try {
                callback(newState)
            } catch (error) {
                console.warn('监听器回调执行失败:', error)
            }
        })
    }

    clearVisibility() {
        try {
            localStorage.removeItem(this.storageKey)
            console.log('清除余额可见性状态')
            return true
        } catch (error) {
            console.warn('清除余额可见性状态失败:', error)
            return false
        }
    }
}

export default new BalanceVisibilityManager()