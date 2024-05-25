export const LocalStorageService = {
  loadItem: <T>(key: string): T | null => {
    const item = localStorage.getItem(key)
    if (!item) return null
    const obj = JSON.parse(item) as T
    //console.log('loaded', key, obj, Object.keys(obj as any))
    return obj
  },
  saveItem: <T>(key: string, item: T) => {
    localStorage.setItem(key, JSON.stringify(item))
  },
} as const
