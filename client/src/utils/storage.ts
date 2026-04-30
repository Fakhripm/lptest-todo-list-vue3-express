const STORAGE_KEY = {
  TOKEN: 'todo_token',
  USER: 'todo_user',
} as const

function set<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (err) {
    console.log('存储设置错误', err)
  }
}

function get<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (!item) return null
    return JSON.parse(item) as T
  } catch (err) {
    console.log('存储获取错误', err)
    return null
  }
}

function remove(key: string): void {
  localStorage.removeItem(key)
}

function clear(): void {
  remove(STORAGE_KEY.TOKEN)
  remove(STORAGE_KEY.USER)
}

export const storage = {
  // token相关
  setToken: (token: string) => set(STORAGE_KEY.TOKEN, token),
  getToken: () => get<string>(STORAGE_KEY.TOKEN),
  removeToken: () => remove(STORAGE_KEY.TOKEN),

  //用户信息相关
  setUser: (user: import('@/types/user').User) => set(STORAGE_KEY.USER, user),
  getUser: () => get<import('@/types/user').User>(STORAGE_KEY.USER),
  removeUser: () => remove(STORAGE_KEY.USER),
  clear,
}
