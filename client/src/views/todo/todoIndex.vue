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
              <span class="date-text">2023年10月27日 · 星期五</span>
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
              <span class="count">1</span>
              <span class="label">条待办</span>
            </div>
          </div>
        </section>

        <section class="input-section">
          <div class="fancy-input-wrapper">
            <div class="plus-icon-container">
              <el-icon :size="20" class="rotating-plus"><Plus /></el-icon>
            </div>
            <input type="text" placeholder="记录新灵感 (最多100字)..." class="pure-input" />
            <div class="input-tip">ENTER</div>
          </div>
        </section>

        <section class="list-section">
          <div class="todo-item is-pending">
            <div class="item-checkbox-wrapper">
              <div class="item-checkbox"></div>
            </div>
            <div class="item-text">深度思考：重构系统组件架构</div>
            <div class="item-actions">
              <el-button link :icon="Edit" class="action-btn edit"></el-button>
              <el-button link :icon="Delete" class="action-btn delete"></el-button>
            </div>
          </div>

          <div class="todo-item is-completed">
            <div class="item-checkbox-wrapper">
              <div class="item-checkbox">
                <el-icon class="check-mark" :size="14"><Check /></el-icon>
              </div>
            </div>
            <div class="item-text">视觉方案评审 - 极致极简版</div>
            <div class="item-actions">
              <el-button link :icon="Edit" class="action-btn edit"></el-button>
              <el-button link :icon="Delete" class="action-btn delete"></el-button>
            </div>
          </div>

          <div class="todo-item is-completed">
            <div class="item-checkbox-wrapper">
              <div class="item-checkbox">
                <el-icon class="check-mark" :size="14"><Check /></el-icon>
              </div>
            </div>
            <div class="item-text">完成 API 文档编写</div>
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
/**
 * 仅保留图标导入，去除所有业务逻辑，方便纯样式练习
 */
import { Plus, Edit, Delete, Calendar, Right, Check } from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
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
      @include mix.flex-center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      .avatar-inner {
        width: 16px;
        height: 16px;
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
      color: vars.$text-main;
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

  .fancy-input-wrapper {
    background: vars.$card-bg;
    padding: 18px 26px;
    border-radius: 30px;
    box-shadow: vars.$shadow-soft;
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
      background: transparent;
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
      border-radius: 12px;
    }
  }

  .todo-item {
    display: flex;
    align-items: center;
    padding: 22px 30px;
    background: rgba(vars.$card-bg, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    margin-bottom: 16px;
    border: none;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &:hover {
      background: vars.$card-bg;
      transform: translateX(8px);
      box-shadow: vars.$shadow-soft;
      .item-actions {
        opacity: 1;
        transform: translateX(0);
      }
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
        @include mix.flex-center;
      }
    }

    .item-text {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: vars.$text-main;
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

    /* 待办状态：主色描边，白底 */
    &.is-pending {
      .item-checkbox {
        border: 2.5px solid vars.$primary-color;
        &:hover {
          transform: scale(1.15);
          border-color: darken(#409eff, 10%);
          background: rgba(vars.$primary-color, 0.02);
        }
      }
    }

    /* 已完成状态：灰色填充，灰色描边，带对勾 */
    &.is-completed {
      opacity: 0.55;
      .item-text {
        text-decoration: line-through;
        color: vars.$text-gray;
      }
      .item-checkbox {
        background: #e0e0e0;
        border: 2.5px solid #d0d0d0;
        .check-mark {
          color: white;
        }
      }
      &:hover {
        transform: none;
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
        color: vars.$text-gray;
        opacity: 0.3;
      }
    }
    .empty-text {
      font-size: 14px;
      color: vars.$text-gray;
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
