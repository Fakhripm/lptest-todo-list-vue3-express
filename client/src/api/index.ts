/**
 * Axios 实例配置
 * 统一 baseURL、请求拦截、响应拦截、错误处理
 */
import axios from 'axios'
import { storage } from '@/utils/storage'
import { ElMessage } from 'element-plus'

// 创建实例
const api = axios.create({
  // 优先读取环境变量，否则使用本地默认地址
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器: 每个请求发送前执行
api.interceptors.request.use(
  (config) => {
    // 从 storage 中取 token, 如果存在则加到请求头 Authorization 中
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    // 请求发送失败的处理
    return Promise.reject(err)
  },
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 响应状态码为 2xx 时直接返回数据部分
    return response.data
  },
  (err) => {
    /**
     * 统一错误处理逻辑
     * 注意：这里不需要写大量的 console.error 或 ElMessage
     * 因为错误会被 throw 传给 UI 组件，由组件通过 getErrorMessage 统一弹窗提示
     */
    if (err.response) {
      const { status } = err.response

      switch (status) {
        case 401:
          storage.clear()
          ElMessage.warning('登录已过期，请重新登录')
          window.location.href = '/login'
          break

        case 403:
          // 权限不足
          break

        case 500:
          // 服务器崩溃兜底
          break
      }
    }

    /**
     * 关键：必须返回 Promise.reject
     * 这样在 LoginForm.vue 里的 try...catch 才能捕获到 catch 分支
     */
    return Promise.reject(err)
  },
)

export default api
