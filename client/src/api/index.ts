/**
 * Axios 实例配置
 * 统一 baseURL、请求拦截、响应拦截、错误处理
 */
import axios from 'axios'
import { storage } from '@/utils/storage'
// import {useUserStore} from '@/types/user'

// 创建实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器: 每个请求发送前执行
api.interceptors.request.use(
  (config) => {
    // 从storage中取token,加到请求头
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    // 请求发不出去
    return Promise.reject(err)
  },
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (err) => {
    // 统一错误处理
    if (err.response) {
      const { status, data } = err.response

      switch (status) {
        case 401:
          // token过期或无效
          storage.clear()
          console.log('登录已过期，请重新登录')
          break

        case 403:
          console.log('你没有权限进行此操作')
          break

        case 404:
          console.error('请求的资源不存在')
          break

        case 500:
          console.error('服务器内部错误')
          break

        default:
          console.error(data?.message || '请求失败')
      }
    } else if (err.request) {
      console.error('网络异常，请检查连接')
    } else {
      console.error('请求配置出错', err.message)
    }
    return Promise.reject(err)
  },
)

export default api
