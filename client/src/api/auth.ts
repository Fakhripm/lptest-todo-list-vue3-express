/**
 * 用户认证相关接口
 * 登录、注册
 */
import api from './index'
import type { LoginParams, LoginResult } from '@/types/user'

// 登录
export function login(params: LoginParams): Promise<LoginResult> {
  return api.post('/auth/login', params)
}

export function register(params: LoginParams): Promise<{ message: string }> {
  return api.post('/auth/register', params)
}

export function getCurrentUser(): Promise<import('@/types/user').User> {
  return api.get('/auth/me')
}
