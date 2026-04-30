/**
 * 用户状态管理
 * 管理登录状态、Token、用户信息
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/auth'
import { storage } from '@/utils/storage'
import type { User, LoginParams, LoginResult } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  //========状态State========
  // 从 storage 恢复初始值，刷新页面不丢失
  const token = ref<string | null>(storage.getToken())
  const user = ref<User | null>(storage.getUser())

  //========计算属性Getters========
  //判断是否有toekn
  const isLoggedIn = computed(() => !!token.value)

  //========方法Actions========
  //登录
  async function login(params: LoginParams): Promise<void> {
    const result: LoginResult = await loginApi(params)

    //存到内存
    token.value = result.token
    user.value = result.user

    storage.setToken(result.token)
    storage.setUser(result.user)
  }

  function logout(): void {
    token.value = null
    user.value = null

    storage.clear()
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
  }
})
