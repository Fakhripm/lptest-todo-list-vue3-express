/**
 * 路由实例 + 导航守卫
 * 创建 router，配置权限校验
 */
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const requiresAuth = !to.meta.public

  if (userStore.isLoggedIn) {
    if (to.path === '/login') {
      return '/todo'
    }
    return true
  }

  if (requiresAuth) {
    return '/login'
  }

  return true
})

router.afterEach((to) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | TodoList`
  }
})

export default router
