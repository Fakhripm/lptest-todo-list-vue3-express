/**
 * Todo 相关接口
 * 增删改查（Token 在拦截器中自动附加）
 */
import api from './index'
import type { Todo, CreateTodoParams } from '@/types/todo'

// 获取所有Todo
export function getTodos(): Promise<Todo[]> {
  return api.get('/todos')
}

// 创建Todo
export function createTodo(params: CreateTodoParams): Promise<Todo> {
  return api.post('/todos', params)
}

// 删除Todo
export function deleteTodo(id: string): Promise<{ message: string }> {
  return api.delete(`/todos/${id}`)
}

// 更新Todo
export function updateTodo(
  id: string,
  params: Partial<CreateTodoParams> & { completed?: boolean },
): Promise<Todo> {
  return api.put(`/todos/${id}`, params)
}
