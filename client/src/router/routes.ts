import type { RouteRecordRaw } from 'vue-router'

// 统一引用容器组件
const AuthView = () => import('@/views/auth/AuthView.vue')
const TodoView = () => import('@/views/todo/todoIndex.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/todo',
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthView,
    meta: { public: true, title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: AuthView,
    meta: { public: true, title: '注册' },
  },
  {
    path: '/todo',
    name: 'Todo',
    component: TodoView,
    meta: { public: false, title: '待办事项' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/todo',
  },
]
