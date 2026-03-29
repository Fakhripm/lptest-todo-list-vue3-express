/**
 * Todo 状态管理
 * 管理 Todo 列表、加载状态、筛选条件
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getTodos as getTodosApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  deleteTodo as deleteTodoApi,
} from '@/api/todo'
import type { Todo, CreateTodoParams } from '@/types/todo'

export const useTodoStore = defineStore('todo', () => {
  // ========== State（状态）==========
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== Getters（计算属性）==========
  const unfinishedCount = computed(() => todos.value.filter((todo) => !todo.completed).length)

  const finishedCount = computed(() => todos.value.filter((todo) => todo.completed).length)

  // 筛选后的列表（后续可扩展筛选功能）
  const filteredTodos = computed(() => todos.value)

  // ========== Actions（方法）==========
  // 获取 Todo 列表
  async function fetchTodos(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const result = await getTodosApi()
      todos.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 创建 Todo
  async function addTodo(title: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const params: CreateTodoParams = { title }
      const newTodo = await createTodoApi(params)
      todos.value.unshift(newTodo) // 新增的放在最前面
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 切换完成状态（乐观更新）
  async function toggleTodo(id: string): Promise<void> {
    const todo = todos.value.find((t) => t._id === id)
    if (!todo) return

    const oldCompleted = todo.completed
    todo.completed = !todo.completed

    try {
      await updateTodoApi(id, { completed: todo.completed })
    } catch (err) {
      todo.completed = oldCompleted // 失败回滚
      error.value = err instanceof Error ? err.message : '更新失败'
      throw err
    }
  }

  // 更新标题（乐观更新）
  async function updateTitle(id: string, title: string): Promise<void> {
    const todo = todos.value.find((t) => t._id === id)
    if (!todo) return

    const oldTitle = todo.title
    todo.title = title

    try {
      await updateTodoApi(id, { title })
    } catch (err) {
      todo.title = oldTitle
      error.value = err instanceof Error ? err.message : '更新标题失败'
      throw err
    }
  }

  // 删除 Todo（乐观更新 + 失败恢复）
  async function removeTodo(id: string): Promise<void> {
    const index = todos.value.findIndex((t) => t._id === id)
    if (index === -1) return

    // 使用非空断言，保证 oldTodo 一定是 Todo 类型
    const oldTodo = todos.value[index]!

    // 乐观删除：先从界面上移除
    todos.value.splice(index, 1)

    try {
      await deleteTodoApi(id)
    } catch (err) {
      // 失败时把之前删除的项恢复回去
      todos.value.splice(index, 0, oldTodo)
      error.value = err instanceof Error ? err.message : '删除失败'
      throw err
    }
  }

  // ========== 导出 ==========
  return {
    // State
    todos,
    loading,
    error,
    // Getters
    unfinishedCount,
    finishedCount,
    filteredTodos,
    // Actions
    fetchTodos,
    addTodo,
    toggleTodo,
    updateTitle,
    removeTodo,
  }
})
