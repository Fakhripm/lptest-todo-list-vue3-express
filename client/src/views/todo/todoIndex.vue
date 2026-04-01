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
            <span class="welcome-text">你好, 执行者</span>
            <div class="date-group">
              <el-icon class="calendar-mini"><Calendar /></el-icon>
              <span class="date-text">2026年4月1日 · 星期三</span>
            </div>
          </div>
        </div>

        <el-button link class="logout-btn">
          <span class="logout-text">退出登录</span>
          <el-icon class="exit-icon"><Right /></el-icon>
        </el-button>
      </header>

      <main class="todo-content">
        <section class="content-header">
          <h2 class="page-title">今日清单</h2>
          <div class="status-badge-wrapper">
            <div class="status-badge">
              <span class="count">3</span>
              <span class="label">条待办</span>
            </div>
          </div>
        </section>

        <section class="input-section">
          <div class="fancy-input-wrapper">
            <div class="plus-icon-container">
              <el-icon :size="20" class="rotating-plus"><Plus /></el-icon>
            </div>
            <input
              type="text"
              placeholder="记录新灵感 (最多100字)..."
              class="pure-input"
              maxlength="100"
            />
            <div class="input-tip">ENTER</div>
          </div>
        </section>

        <section class="list-section">
          <div class="todo-item is-pending">
            <div class="item-checkbox-wrapper">
              <div class="item-checkbox"></div>
            </div>
            <div class="item-text">完成 API 接口联调与功能对齐</div>
            <div class="item-actions">
              <el-button link :icon="Edit" class="action-btn edit"></el-button>
              <el-button link :icon="Delete" class="action-btn delete"></el-button>
            </div>
          </div>

          <div class="todo-item is-completed">
            <div class="item-checkbox-wrapper">
              <div class="item-checkbox">
                <el-icon class="check-mark" :size="12"><Check /></el-icon>
              </div>
            </div>
            <div class="item-text">用户认证模块 (登录/注册) 开发</div>
            <div class="item-actions">
              <el-button link :icon="Edit" class="action-btn edit"></el-button>
              <el-button link :icon="Delete" class="action-btn delete"></el-button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Edit, Delete, Calendar, Right, Check } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as vars;
@use '@/assets/styles/mixins.scss' as mix;

.todo-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: vars.$bg-color;
  position: relative;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  font-family: 'SF Pro Display', sans-serif;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba(vars.$text-main, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(vars.$text-main, 0.03) 1px, transparent 1px);
  background-size: 45px 45px;
}

.todo-container {
  width: 90%;
  max-width: 680px;
  padding: 60px 0;
  position: relative;
  z-index: 1;
}

/* 十、九、头部与头像优化 */
.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 70px;

  .user-profile {
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;

    .avatar-box {
      width: 44px;
      height: 44px;
      background: white;
      border-radius: vars.$radius-base;
      border: 1px solid rgba(0, 0, 0, 0.05);
      @include mix.flex-center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      .avatar-inner {
        width: 14px;
        height: 14px;
        background: vars.$text-main;
        border-radius: 50%;
      }
    }

    &:hover .avatar-box {
      transform: scale(1.1) rotate(5deg);
      box-shadow: vars.$shadow-soft;
    }

    .user-info {
      .welcome-text {
        font-weight: 800;
        font-size: 17px;
        color: vars.$text-main;
        display: block;
      }
      .date-group {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
        .calendar-mini {
          font-size: 12px;
          color: vars.$primary-color;
        }
        .date-text {
          font-size: 12px;
          color: vars.$text-gray;
          font-weight: 500;
        }
      }
    }
  }

  .logout-btn {
    @include mix.active-push;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 4px;

    .logout-text {
      font-size: 13px;
      color: vars.$text-gray;
      font-weight: 600;
      transition: all 0.3s;
    }
    .exit-icon {
      font-size: 14px;
      color: vars.$text-gray;
      opacity: 0;
      transform: translateX(-5px);
      transition: all 0.3s;
    }

    &:hover {
      .logout-text {
        color: vars.$danger-color;
        transform: translateX(-4px);
      }
      .exit-icon {
        color: vars.$danger-color;
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
}

/* 四、状态徽章动画 */
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

.status-badge-wrapper {
  animation: badge-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.2s;
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
      color: vars.$text-main;
      margin: 0;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 14px;
      background: white;
      border-radius: 30px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      .count {
        font-weight: 800;
        color: vars.$primary-color;
        font-size: 14px;
      }
      .label {
        font-size: 11px;
        font-weight: 700;
        color: vars.$text-gray;
      }
    }
  }

  /* 三、八、输入框动画与规范 */
  .fancy-input-wrapper {
    background: vars.$card-bg;
    padding: 18px 24px;
    border-radius: vars.$radius-card;
    box-shadow: vars.$shadow-soft;
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 50px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &:focus-within {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
      .rotating-plus {
        transform: rotate(90deg);
        color: vars.$primary-color;
      }
    }

    .plus-icon-container {
      width: 24px;
      @include mix.flex-center;
      .rotating-plus {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        color: vars.$text-gray;
      }
    }

    .pure-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 16px;
      font-weight: 600;
      color: vars.$text-main;
      &::placeholder {
        color: vars.$text-gray;
        opacity: 0.45;
      }
    }

    .input-tip {
      font-size: 10px;
      font-weight: 800;
      color: vars.$text-gray;
      opacity: 0.3;
      padding: 4px 10px;
      border: 1.5px solid rgba(vars.$text-gray, 0.15);
      border-radius: 10px;
    }
  }

  /* 一、二、五、六、任务列表优化 */
  .todo-item {
    display: flex;
    align-items: center;
    padding: 22px 26px;
    background: rgba(vars.$card-bg, 0.8);
    backdrop-filter: blur(12px);
    border-radius: vars.$radius-base;
    margin-bottom: 16px;
    border: 1px solid transparent;
    border-left: 5px solid transparent;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); // 五、优化滑动顺滑度

    &:hover {
      background: vars.$card-bg;
      transform: translateX(8px); // 移除 scale 避免抖动，仅保留位移
      box-shadow: vars.$shadow-soft;
      .item-actions {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .item-checkbox-wrapper {
      margin-right: 22px;
      .item-checkbox {
        width: 24px;
        height: 24px;
        border: 2.5px solid vars.$border-color;
        border-radius: 8px;
        background: white;
        transition: all 0.3s;
        @include mix.flex-center;

        &:hover {
          transform: scale(1.15); // 一、复选框缩放
          border-color: vars.$primary-color;
          background: rgba(vars.$primary-color, 0.05);
        }
      }
    }

    .item-text {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: vars.$text-main;
      transition: all 0.3s;
    }

    .item-actions {
      opacity: 0;
      display: flex;
      gap: 14px;
      transform: translateX(10px);
      transition: all 0.3s;
      .action-btn {
        font-size: 19px;
        transition: all 0.2s;
        &:hover {
          transform: scale(1.2);
        } // 六、按钮缩放
        &.edit {
          color: vars.$text-gray;
          &:hover {
            color: vars.$primary-color;
          }
        }
        &.delete {
          color: vars.$text-gray;
          &:hover {
            color: vars.$danger-color;
          }
        }
      }
    }

    &.is-pending {
      border-left-color: vars.$primary-color;
    }

    &.is-completed {
      opacity: 0.5;
      border-left-color: rgba(vars.$text-gray, 0.2);
      .item-checkbox {
        // 二、已完成勾选框视觉降权
        background: rgba(vars.$text-gray, 0.1);
        border-color: transparent;
        .check-mark {
          color: vars.$text-gray;
        }
      }
      .item-text {
        text-decoration: line-through;
        color: vars.$text-gray;
      }
      &:hover {
        transform: none;
      }
    }
  }
}
</style>
