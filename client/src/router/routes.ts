/**
 * 路由表定义
 * 只配置路径和组件映射，不加逻辑
 */

import type { RouteRecordRaw } from 'vue-router'

// 懒加载组件，减少首屏体积
const LoginView = () => import('@/views/login/loginIndex.vue')
const TodoView = () => import('@/views/todo/todoIndex.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/todo',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      public: true,
      title: '登录',
    },
  },
  {
    path: '/todo',
    name: 'Todo',
    component: TodoView,
    meta: {
      public: false,
      title: '待办事项',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/todo',
  },
]
