<template>
  <div class="todo-wrapper">
    <div class="grid-overlay"></div>

    <div class="todo-container">
      <header class="todo-header">
        <div class="user-profile">
          <div class="avatar-box">
            <div class="avatar-inner"></div>
          </div>
          <div class="user-info">
            <span class="welcome-text">你好, {{ userStore.user?.username || 'emo' }}</span>
            <div class="date-group">
              <el-icon class="calendar-mini"><Calendar /></el-icon>
              <span class="date-text">{{ currentDate }}</span>
            </div>
          </div>
        </div>

        <el-button link class="logout-btn" @click="handleLogout">
          <span class="logout-text">退出登录</span>
          <el-icon class="exit-icon"><Right /></el-icon>
        </el-button>
      </header>

      <main class="todo-content">
        <section class="content-header">
          <h2 class="page-title">今日清单</h2>
          <div class="status-badge-wrapper">
            <div class="status-badge">
              <span class="count">{{ todoStore.unfinishedCount }}</span>
              <span class="label">条待办</span>
            </div>
          </div>
        </section>

        <section class="input-section">
          <div class="fancy-input-wrapper">
            <div class="plus-icon-container" @click="handleAddTodo">
              <el-icon :size="20" class="rotating-plus" v-loading="isSubmitting"><Plus /></el-icon>
            </div>
            <input
              type="text"
              v-model="newTodoTitle"
              @keydown="handleKeydown"
              placeholder="记录新灵感 (最多100字)..."
              class="pure-input"
              maxlength="100"
              :disabled="isSubmitting"
            />
            <div class="input-tip">ENTER</div>
          </div>
        </section>

        <section class="list-section">
          <div
            v-for="todo in todoStore.todos"
            :key="todo._id"
            class="todo-item"
            :class="{
              'is-pending': !todo.completed,
              'is-completed': todo.completed,
            }"
          >
            <div class="item-checkbox-wrapper" @click="handleToggle(todo)">
              <div class="item-checkbox">
                <el-icon v-if="todo.completed" class="check-mark" :size="14">
                  <Check />
                </el-icon>
              </div>
            </div>

            <div class="item-text">{{ todo.title }}</div>
            <div class="item-actions">
              <el-button
                link
                :icon="Edit"
                class="action-btn edit"
                @click.stop="handleEdit(todo)"
              ></el-button>
              <el-button
                link
                :icon="Delete"
                class="action-btn delete"
                @click.stop="handleDelete(todo)"
              ></el-button>
            </div>
          </div>
          <div v-if="todoStore.todos.length === 0 && !todoStore.loading" class="empty-state">
            <div class="empty-icon-wrapper">
              <el-icon :size="54" class="empty-icon"><Edit /></el-icon>
            </div>
            <p class="empty-text">今日暂无待办，开始你的第一条灵感吧</p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useTodoStore } from '@/stores/todo'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Calendar, Right, Check } from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import type { Todo } from '@/types/todo'

const router = useRouter()
const todoStore = useTodoStore()
const userStore = useUserStore()

// 输入框临时存放点
const newTodoTitle = ref<string>('')
const isSubmitting = ref(false)

// 显示当前日期
const currentDate = computed(() => {
  const now = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  // 拼接字符串
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 · ${weekdays[now.getDay()]}`
})

// 辅助函数：安全提取错误信息
function getErrorMessage(error: unknown, defaultMsg: string): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return defaultMsg
}
// 添加任务
async function handleAddTodo() {
  const title = newTodoTitle.value.trim()
  if (!title) {
    ElMessage.warning('请输入任务内容')
    return
  }
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    await todoStore.addTodo(title)
    newTodoTitle.value = ''
    ElMessage.success('添加成功')
  } catch (error: unknown) {
    const errorMsg = getErrorMessage(error, '添加失败')
    ElMessage.error(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}
// 保险 用于监听键盘事件
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleAddTodo()
  }
}
// 切换任务完成状态
async function handleToggle(todo: Todo) {
  try {
    await todoStore.toggleTodo(todo._id)
  } catch (error: unknown) {
    const msg = getErrorMessage(error, '操作失败')
    ElMessage.error(msg)
  }
}
// 删除任务
async function handleDelete(todo: Todo) {
  try {
    await ElMessageBox.confirm(`确定要删除任务 ${todo.title} 吗？`, '风险提示', {
      confirmButtonText: '确定删除',
      cancelButtonText: '点错了',
      type: 'warning',
      customClass: 'modern-confirm-box',
    })
    await todoStore.removeTodo(todo._id)
    ElMessage.success('已从清单中移除')
  } catch (error: unknown) {
    if (error !== 'cancel') {
      ElMessage.error(getErrorMessage(error, '删除失败'))
    }
  }
}

// 编辑任务标题
async function handleEdit(todo: Todo) {
  try {
    const { value } = await ElMessageBox.prompt('重命名灵感', '编辑内容', {
      confirmButtonText: '保存修改',
      cancelButtonText: '取消',
      inputValue: todo.title,
      inputPlaceholder: '请输入新的灵感内容...',
      inputValidator: (val) => {
        if (!val || !val.trim()) return '内容不能为空'
        if (val.length > 100) return '内容不能超过 100 个字'
        return true
      },
      customClass: 'modern-confirm-box',
    })

    if (value && value.trim() !== todo.title) {
      // 调用 store 中已有的 updateTitle 方法
      await todoStore.updateTitle(todo._id, value.trim())
      ElMessage.success('更新成功')
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      ElMessage.error(getErrorMessage(error, '更新标题失败'))
    }
  }
}

//退出登录
async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定退出当前账号？', '提示', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'info',
      customClass: 'modern-confirm-box',
    })
    userStore.logout()
    router.push('/login')
    ElMessage.success('已安全退出')
  } catch {}
}

onMounted(() => {
  todoStore.fetchTodos().catch((error: unknown) => {
    ElMessage.error(getErrorMessage(error, '获取列表失败'))
  })
})
</script>

<style lang="scss" scoped>
.todo-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: $bg-color;
  position: relative;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  font-family:
    'SF Pro Display',
    -apple-system,
    sans-serif;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba($text-main, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba($text-main, 0.03) 1px, transparent 1px);
  background-size: 45px 45px;
}

.todo-container {
  width: 90%;
  max-width: 680px;
  padding: 60px 0;
  position: relative;
  z-index: 1;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 70px;

  .user-profile {
    display: flex;
    align-items: center;
    gap: 16px;

    .avatar-box {
      width: 46px;
      height: 46px;
      background: white;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.05);
      @include flex-center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      .avatar-inner {
        width: 16px;
        height: 16px;
        background: $text-main;
        border-radius: 50%;
      }
    }

    &:hover .avatar-box {
      transform: scale(1.1) rotate(5deg);
      box-shadow: $shadow-soft;
    }

    .user-info {
      .welcome-text {
        font-weight: 800;
        font-size: 17px;
        color: $text-main;
        display: block;
      }
      .date-group {
        display: flex;
        align-items: center;
        gap: 6px;
        .calendar-mini {
          font-size: 12px;
          color: $primary-color;
        }
        .date-text {
          font-size: 12px;
          color: $text-gray;
          font-weight: 500;
        }
      }
    }
  }

  .logout-btn {
    @include active-push;
    padding: 8px 12px;
    cursor: pointer;
    .logout-text {
      font-size: 13px;
      color: $text-gray;
      font-weight: 600;
      transition: all 0.3s;
    }
    .exit-icon {
      font-size: 14px;
      color: $text-gray;
      opacity: 0;
      transform: translateX(-5px);
      transition: all 0.3s;
    }
    &:hover {
      .logout-text {
        color: $danger-color;
        transform: translateX(-4px);
      }
      .exit-icon {
        color: $danger-color;
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
}

.status-badge-wrapper {
  animation: badge-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.todo-content {
  .content-header {
    display: flex;
    align-items: flex-end;
    gap: 15px;
    margin-bottom: 40px;
    .page-title {
      font-size: 48px;
      font-weight: 850;
      letter-spacing: -2.5px;
      color: $text-main;
      margin: 0;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 16px;
      background: white;
      border-radius: 30px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      .count {
        font-weight: 800;
        color: $primary-color;
        font-size: 14px;
      }
      .label {
        font-size: 11px;
        font-weight: 700;
        color: $text-gray;
      }
    }
  }

  .fancy-input-wrapper {
    background: $card-bg;
    padding: 18px 26px;
    border-radius: 30px;
    box-shadow: $shadow-soft;
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 50px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &:focus-within {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
      .rotating-plus {
        transform: rotate(90deg);
        color: $primary-color;
      }
    }

    .plus-icon-container {
      width: 24px;
      @include flex-center;
      cursor: pointer;
      .rotating-plus {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        color: $text-gray;
      }
    }

    .pure-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 16px;
      font-weight: 600;
      color: $text-main;
      background: transparent;
      &::placeholder {
        color: $text-gray;
        opacity: 0.45;
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .input-tip {
      font-size: 10px;
      font-weight: 800;
      color: $text-gray;
      opacity: 0.3;
      padding: 4px 10px;
      border: 1.5px solid rgba($text-gray, 0.15);
      border-radius: 12px;
    }
  }

  .todo-item {
    display: flex;
    align-items: center;
    padding: 22px 30px;
    background: rgba($card-bg, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    margin-bottom: 16px;
    border: none;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &:hover {
      transform: translateY(-3px);
      box-shadow: $shadow-mid;
    }

    .item-checkbox-wrapper {
      margin-right: 22px;
      cursor: pointer;
      .item-checkbox {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: white;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        @include flex-center;
      }
    }

    .item-text {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: $text-main;
      transition: color 0.3s ease;
    }

    .item-actions {
      opacity: 0;
      display: flex;
      gap: 14px;
      transform: translateX(10px);
      transition: all 0.3s;
      .action-btn {
        font-size: 20px;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        &:hover {
          transform: scale(1.2) translateY(-2px);
        }
        &.edit {
          color: $text-gray;
          &:hover {
            color: $primary-color;
          }
        }
        &.delete {
          color: $text-gray;
          &:hover {
            color: $danger-color;
          }
        }
      }
    }

    &.is-pending {
      .item-checkbox {
        border: 2.5px solid $primary-color;
        &:hover {
          transform: scale(1.15);
          border-color: color.adjust($primary-color, $lightness: -10%);
          background: rgba($primary-color, 0.02);
        }
      }
    }

    &.is-completed {
      opacity: 0.6;
      .item-text {
        text-decoration: line-through;
        color: $text-gray;
      }
      .item-checkbox {
        background: color.adjust($bg-color, $lightness: -5%);
        border: 2.5px solid color.adjust($bg-color, $lightness: -10%);
        .check-mark {
          color: $text-gray;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    .empty-icon-wrapper {
      display: inline-block;
      margin-bottom: 20px;
      animation: floating 3s ease-in-out infinite;
      .empty-icon {
        color: $text-gray;
        opacity: 0.3;
      }
    }
    .empty-text {
      font-size: 14px;
      color: $text-gray;
      font-weight: 600;
      opacity: 0.5;
    }
  }
}

@keyframes badge-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes floating {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
