<template>
  <div class="login-wrapper">
    <el-card class="login-card" shadow="always">
      <div class="login-content">
        <div class="header-section">
          <div class="organic-logo">
            <div class="circle-ring"></div>
            <div class="circle-core"></div>
          </div>
          <h1 class="brand-title">TodoList</h1>
          <p class="brand-subtitle">简约日程，让生活呼吸顺畅</p>
        </div>

        <el-form class="login-form">
          <el-form-item>
            <el-input placeholder="邮箱 / 用户名" size="large" class="custom-input" />
          </el-form-item>

          <el-form-item>
            <el-input
              type="password"
              placeholder="密码"
              show-password
              size="large"
              class="custom-input"
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox label="保持登录状态" />
          </div>

          <el-form-item>
            <el-button type="primary" class="submit-btn"> 开始今日清单 </el-button>
          </el-form-item>
        </el-form>

        <div class="footer-section">
          <span class="hint-text">还没有加入？</span>
          <el-link :underline="false" class="register-link">立即注册</el-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
/* 注意：这里不要再写 @import 或 @use 变量文件了，因为你在 vite.config 里已经自动注入了 */
/* 我们只需在这里引入 Sass 自带的 color 模块来处理颜色函数 */
@use 'sass:color';

.login-wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bg-color;
}

.login-card {
  width: 90%;
  max-width: 400px;
  border-radius: $radius-card;
  border: none;
  box-shadow: $shadow-soft !important;

  :deep(.el-card__body) {
    padding: 60px 45px;
  }
}

.login-content {
  .header-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 45px;

    .organic-logo {
      position: relative;
      width: 48px;
      height: 48px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      .circle-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-top-color: $primary-color;
        border-right-color: rgba($primary-color, 0.3);
        border-bottom-color: rgba($primary-color, 0.1);
        border-left-color: rgba($primary-color, 0.6);
        border-radius: 50%;
        animation: rotate-ring 4s linear infinite;
      }

      .circle-core {
        width: 14px;
        height: 14px;
        background-color: $text-main;
        border-radius: 50%;
        transition: all 0.4s ease;
      }
    }

    &:hover {
      .circle-core {
        transform: scale(1.4);
        background-color: $primary-color;
      }
    }

    .brand-title {
      font-size: 32px;
      font-weight: 700;
      color: $text-main;
      margin: 0;
      letter-spacing: -1px;
    }

    .brand-subtitle {
      font-size: 14px;
      color: $text-gray;
      margin-top: 10px;
    }
  }

  .form-options {
    margin-bottom: 25px;
    :deep(.el-checkbox__label) {
      font-size: 13px;
      color: $text-gray;
    }
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: $text-main;
      border-color: $text-main;
    }
  }

  .submit-btn {
    width: 100%;
    height: 54px;
    background-color: $text-main;
    border: none;
    border-radius: $radius-base;
    font-size: 16px;
    font-weight: 600;
    @include active-push;

    &:hover {
      // 修正：使用 color.adjust 替代 lighten
      background-color: color.adjust($text-main, $lightness: 10%);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
  }

  .footer-section {
    margin-top: 35px;
    display: flex;
    justify-content: center;
    gap: 6px;
    font-size: 14px;

    .hint-text {
      color: $text-gray;
    }
    .register-link {
      color: $primary-color;
      font-weight: 600;
    }
  }
}

@keyframes rotate-ring {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.el-input__wrapper) {
  // 修正：使用 color.adjust 替代 darken
  background-color: color.adjust($bg-color, $lightness: -2%) !important;
  box-shadow: none !important;
  border-radius: $radius-input;
  padding: 10px 18px;
  border: 1px solid transparent;
  transition: all 0.2s;

  &.is-focus {
    background-color: #fff !important;
    border-color: $text-main !important;
  }
}
</style>
