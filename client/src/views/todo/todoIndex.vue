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
          <div class="header-left">
            <h2 class="page-title">今日清单</h2>
            <p class="motivation-text">{{ motivationMessage }}</p>
          </div>

          <div class="header-right-stats">
            <div class="stats-item">
              <span class="stats-label">待处理</span>
              <span class="stats-value">{{ todoStore.unfinishedCount }}</span>
            </div>
            <div class="stats-divider"></div>
            <div class="progress-box">
              <el-progress
                type="circle"
                :percentage="completionPercentage"
                :width="54"
                :stroke-width="6"
                :color="progressColors"
              >
                <template #default>
                  <span class="tiny-percentage">{{ completionPercentage }}%</span>
                </template>
              </el-progress>
            </div>
          </div>
        </section>

        <section class="input-section">
          <div class="fancy-input-wrapper" :class="{ 'is-shaking': shakeActive }">
            <div class="plus-icon-container" @click="handleAddTodo">
              <el-icon :size="20" :class="isSubmitting ? 'loading-icon' : 'rotating-plus'">
                <component :is="isSubmitting ? Loading : Plus" />
              </el-icon>
            </div>

            <div class="input-inner-wrapper">
              <input
                ref="taskInput"
                v-model="newTodoTitle"
                type="text"
                class="pure-input"
                placeholder="记下这一刻的灵感..."
                @keydown.enter="handleAddTodo"
              />
              <span class="char-counter" :class="{ 'is-near-limit': newTodoTitle.length > 80 }">
                {{ newTodoTitle.length }}/100
              </span>
            </div>

            <div class="input-tip" @click="handleAddTodo" style="cursor: pointer">Enter</div>
          </div>
        </section>

        <section class="list-section">
          <draggable
            v-model="todoStore.todos"
            group="tasks"
            @end="onDragEnd"
            class="todo-list-wrapper"
            item-key="_id"
          >
            <template #item="{ element: todo }">
              <div
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

                <div class="item-text" @dblclick="handleEdit(todo)">
                  {{ todo.title }}
                </div>

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
            </template>
          </draggable>

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
import { getErrorMessage } from '@/utils/error'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Calendar, Right, Check, Plus, Loading } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import type { Todo } from '@/types/todo'
import 'element-plus/dist/index.css'

// 1. 基础/路由依赖
const router = useRouter()
const todoStore = useTodoStore()
const userStore = useUserStore()

// 2. 状态定义
const newTodoTitle = ref<string>('')
const isSubmitting = ref(false)
const shakeActive = ref(false)
const taskInput = ref<HTMLInputElement | null>(null)
const progressColors = [
  { color: '#909399', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#1989fa', percentage: 60 },
  { color: '#67c23a', percentage: 80 },
  { color: '#626aef', percentage: 100 },
]
const motivationMessage = computed(() => {
  const percentage = completionPercentage.value
  const total = todoStore.todos.length

  if (total === 0) return '点击下方，开启今日的第一条灵感 ✨'
  if (percentage === 0) return '种一棵树最好的时间是现在，开始吧 🚀'
  if (percentage < 50) return '进度过半，保持节奏，你做得很好 👊'
  if (percentage < 100) return '即将达成目标，最后冲刺一下 ⚡'
  return '太棒了！今日灵感已全部捕捉完成 🎉'
})

// 3. 计算属性
const currentDate = computed(() => {
  const now = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  const day = weekdays[now.getDay()]
  return `${year}年${month}月${date}日 · ${day}`
})
const completionPercentage = computed(() => {
  const total = todoStore.todos.length
  if (total === 0) return 0
  const completed = todoStore.todos.filter((t) => t.completed).length
  return Math.round((completed / total) * 100)
})

// 4. 核心业务逻辑

/** 添加待办 */
const handleAddTodo = async () => {
  const title = newTodoTitle.value.trim()

  if (!title) {
    shakeActive.value = true
    taskInput.value?.focus()
    setTimeout(() => {
      shakeActive.value = false
    }, 600)
    ElMessage.warning('请输入任务内容')
    return
  }

  if (title.length > 100) {
    shakeActive.value = true
    ElMessage.error('灵感太长了，请精简至 100 字以内')
    return
  }

  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    await todoStore.addTodo(title)
    newTodoTitle.value = ''
    taskInput.value?.focus()
    ElMessage.success('添加成功')
  } catch (error: unknown) {
    ElMessage.error(getErrorMessage(error, '添加失败'))
  } finally {
    isSubmitting.value = false
  }
}

/** 状态切换 */
const handleToggle = async (todo: Todo) => {
  try {
    await todoStore.toggleTodo(todo._id)
  } catch (error: unknown) {
    ElMessage.error(getErrorMessage(error, '操作失败'))
  }
}

/** 编辑待办 */
const handleEdit = async (todo: Todo) => {
  try {
    setTimeout(() => {
      const input = document.querySelector(
        '.modern-confirm-box .el-input__inner',
      ) as HTMLInputElement
      if (input) {
        input.focus()
        input.select()
      }
    }, 10)

    const { value } = await ElMessageBox.prompt('重命名灵感', '编辑内容', {
      confirmButtonText: '保存修改',
      cancelButtonText: '取消',
      inputValue: todo.title,
      inputPlaceholder: '请输入新的灵感内容...',
      showClose: false,
      customClass: 'modern-confirm-box',
      inputValidator: (val) => {
        if (!val || !val.trim()) return '内容不能为空'
        if (val.length > 100) return '内容不能超过 100 个字'
        return true
      },
    })

    if (value && value.trim() !== todo.title) {
      await todoStore.updateTitle(todo._id, value.trim())
      ElMessage.success('更新成功')
    }
  } catch (error: unknown) {
    if (error !== 'cancel' && error !== 'close')
      ElMessage.error(getErrorMessage(error, '更新标题失败'))
  }
}

/** 删除待办 */
const handleDelete = async (todo: Todo) => {
  try {
    await ElMessageBox.confirm(`确定要删除任务 ${todo.title} 吗？`, '风险提示', {
      confirmButtonText: '确定删除',
      cancelButtonText: '点错了',
      type: 'warning',
      customClass: 'modern-confirm-box',
      showClose: false,
    })
    await todoStore.removeTodo(todo._id)
    ElMessage.success('已从清单中移除')
  } catch (error: unknown) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(getErrorMessage(error, '删除失败'))
  }
}

/** 拖拽完成事件 */
const onDragEnd = (event: unknown) => {
  console.log('拖拽完成', event)
}

// 5. 账户逻辑
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定退出当前账号？', '提示', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'info',
      customClass: 'modern-confirm-box',
      showClose: false,
    })
    userStore.logout()
    router.push('/login')
    ElMessage.success('已安全退出')
  } catch {
    /* 取消不处理 */
  }
}

// 6. 生命周期
onMounted(() => {
  todoStore.fetchTodos().catch((error: unknown) => {
    ElMessage.error(getErrorMessage(error, '获取列表失败'))
  })
})
</script>

<style lang="scss" scoped>
/* 层级结构:
  1. Variables & Mixins (基础变量)
  2. Layout (基础布局)
  3. Header (用户信息 & 统计卡片)
  4. Input Section (输入区域)
  5. List Section (任务列表)
  6. Animations (动画集)
*/

/* --- 1. Variables & Mixins --- */
$apple-gray: #86868b;
$apple-black: #1d1d1f;
$apple-bg: #f2f2f7;

/* --- 2. Layout --- */
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
    'PingFang SC',
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

/* --- 3. Header Area --- */
.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;

  .user-profile {
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;

    &:hover {
      .avatar-box {
        transform: scale(1.05) translateY(-2px);
        background: white;
        box-shadow: $shadow-mid;
      }
      .avatar-inner {
        background: $primary-color;
        border-color: $primary-color;
        transform: rotate(-3deg);
        &::before {
          background: white;
          box-shadow:
            0 5px 0 white,
            0 10px 0 white;
        }
        &::after {
          background: linear-gradient(135deg, white 50%, rgba(255, 255, 255, 0.4) 50%);
          border-color: white;
        }
      }
      .welcome-text {
        color: $primary-color;
      }
    }

    .avatar-box {
      width: 52px;
      height: 52px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 14px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      @include flex-center;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .avatar-inner {
      width: 22px;
      height: 28px;
      background: rgba($primary-color, 0.08);
      border-radius: 3px;
      border: 1.5px solid rgba($primary-color, 0.3);
      position: relative;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      &::after {
        content: '';
        position: absolute;
        top: -1.5px;
        right: -1.5px;
        width: 7px;
        height: 7px;
        background: linear-gradient(135deg, $bg-color 50%, rgba($primary-color, 0.2) 50%);
        border-bottom-left-radius: 3px;
        border-left: 1.5px solid rgba($primary-color, 0.3);
        border-bottom: 1.5px solid rgba($primary-color, 0.3);
      }
      &::before {
        content: '';
        position: absolute;
        top: 9px;
        left: 4px;
        width: 11px;
        height: 2px;
        background: rgba($primary-color, 0.4);
        border-radius: 1px;
        box-shadow:
          0 5px 0 rgba($primary-color, 0.4),
          0 10px 0 rgba($primary-color, 0.4);
      }
    }

    .welcome-text {
      font-weight: 850;
      font-size: 17px;
      color: $text-main;
      letter-spacing: -0.5px;
    }
  }
  .date-text {
    font-size: 13px;
  }
  .logout-btn {
    @include active-push;
    padding: 8px 12px;
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
  }
}

/* --- 3.1 Content Header (Statistics Card) --- */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;

  .header-left {
    .page-title {
      font-size: 42px;
      font-weight: 900;
      letter-spacing: -1.5px;
      color: $apple-black;
      line-height: 1.1;
      margin: 0;
    }
    .motivation-text {
      margin-top: 8px;
      font-size: 13px;
      font-weight: 500;
      color: $apple-gray;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  .header-right-stats {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    padding: 10px 18px;
    border-radius: 22px;
    border: 1px solid rgba(0, 0, 0, 0.05);

    .stats-item {
      display: flex;
      flex-direction: column;
      align-items: center; // 关键修正：确保待处理和数字中心对齐
      text-align: center;
      min-width: 48px;

      .stats-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: $apple-gray;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      .stats-value {
        font-size: 22px;
        font-weight: 800;
        color: $apple-black;
        line-height: 1;
      }
    }

    .stats-divider {
      width: 1px;
      height: 24px;
      background: rgba(0, 0, 0, 0.08);
    }

    .progress-box {
      .tiny-percentage {
        font-size: 11px;
        font-weight: 700;
        color: $apple-black;
      }
    }
  }
}

/* Deep override for Element Plus Progress */
:deep(.el-progress-circle__track) {
  stroke: $apple-bg;
}

/* --- 4. Input Section --- */
.fancy-input-wrapper {
  background: $card-bg;
  padding: 14px 22px;
  border-radius: 20px;
  box-shadow: $shadow-soft;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 50px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  &.is-shaking {
    animation: shake-horizontal 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    border-color: rgba($danger-color, 0.4) !important;
  }

  &:focus-within {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    border-color: rgba($primary-color, 0.2);
    .rotating-plus {
      transform: rotate(-180deg) scale(0.9);
      color: $primary-color;
    }
    .input-tip {
      background: $primary-color;
      color: white;
      border-color: $primary-color;
      box-shadow: 0 4px 0 $primary-dark;
      transform: translateY(-2px);
    }
  }

  .plus-icon-container {
    width: 24px;
    height: 24px;
    @include flex-center;
    cursor: pointer;
    .rotating-plus {
      transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      color: $text-gray;
    }
    .loading-icon {
      color: $primary-color;
      animation: rotating 1.2s linear infinite;
    }
  }

  .input-inner-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
  }
  .pure-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 600;
    color: $text-main;
    background: transparent;
    padding-right: 50px;
    &::placeholder {
      color: $text-gray;
      opacity: 0.35;
    }
  }

  .char-counter {
    position: absolute;
    right: 0;
    font-size: 11px;
    font-weight: 700;
    color: $text-gray;
    opacity: 0.4;
    background: rgba(0, 0, 0, 0.04);
    padding: 2px 6px;
    border-radius: 6px;
    &.is-near-limit {
      color: $warning-color;
      background: rgba($warning-color, 0.1);
      opacity: 1;
    }
  }

  .input-tip {
    font-size: 11px;
    font-weight: 800;
    color: $text-gray;
    background: #fdfdfd;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1.5px solid #e2e2e7;
    box-shadow: 0 3px 0 #d1d1d6;
    transition: all 0.3s;
    user-select: none;
  }
}

/* --- 5. List Section --- */
.todo-item {
  display: flex;
  align-items: flex-start;
  padding: 22px 30px;
  background: rgba($card-bg, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  margin-bottom: 16px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  box-sizing: border-box;
  width: 100%;

  &:hover {
    transform: translateY(-3px);
    box-shadow: $shadow-mid;
    .item-actions {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .item-checkbox-wrapper {
    margin-right: 22px;
    margin-top: 2px;
    cursor: pointer;
    .item-checkbox {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: white;
      @include flex-center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  .item-text {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: $text-main;
    line-height: 1.5;
    transition: color 0.2s ease;
    white-space: pre-wrap;
    word-break: break-all;
    cursor: pointer;
    &:hover {
      color: $primary-color;
    }
  }

  .item-actions {
    margin-top: 2px;
    display: flex;
    gap: 14px;
    opacity: 0;
    transform: translateX(15px);
    transition: all 0.3s ease;
    .action-btn {
      padding: 4px;
      font-size: 20px;
      color: $text-gray;
      &:hover {
        transform: scale(1.2);
        &.edit {
          color: $primary-color;
        }
        &.delete {
          color: $danger-color;
        }
      }
    }
  }

  &.is-pending .item-checkbox {
    border: 2.5px solid $primary-color;
  }
  &.is-completed {
    opacity: 0.6;
    .item-text {
      text-decoration: line-through;
      color: $text-gray;
    }
    .item-checkbox {
      background: rgba($border-color, 0.2);
      border: 2.5px solid $border-color;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  .empty-icon-wrapper {
    animation: floating 3s ease-in-out infinite;
    opacity: 0.3;
  }
  .empty-text {
    margin-top: 15px;
    font-size: 14px;
    color: $text-gray;
    font-weight: 600;
    opacity: 0.5;
  }
}

/* --- 6. Animations --- */
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.9);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.list-leave-active {
  position: absolute;
  pointer-events: none;
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes shake-horizontal {
  10%,
  90% {
    transform: translate3d(-1px, -4px, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, -4px, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, -4px, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, -4px, 0);
  }
}
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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
