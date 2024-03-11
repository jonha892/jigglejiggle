

export const LocalStorageService = {
    loadItem: <T>(key: string): T | null => {
        const item = localStorage.getItem(key)
        if (!item) return null
        return JSON.parse(item) as T
    },
    saveItem: <T>(key: string, item: T) => {
        localStorage.setItem(key, JSON.stringify(item))
    }
} as const