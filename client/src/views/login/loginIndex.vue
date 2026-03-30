<template>
  <div class="login-wrapper">
    <div class="grid-overlay"></div>

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

        <el-form class="login-form" ref="formRef">
          <el-form-item>
            <el-input
              placeholder="请输入邮箱 / 用户名"
              size="large"
              class="custom-input"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-input
              type="password"
              placeholder="请输入密码"
              show-password
              size="large"
              class="custom-input"
              clearable
            />
          </el-form-item>

          <el-form-item class="submit-item">
            <el-button type="primary" class="submit-btn"> 开始今日清单 </el-button>
          </el-form-item>
        </el-form>

        <div class="footer-section">
          <span class="hint-text">还没有加入？</span>
          <el-link underline="never" class="register-link">立即注册</el-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 此时暂无 Script 逻辑
 * 后续可在此处添加 handleLogin 异步请求
 */
</script>

<style lang="scss" scoped>
@use 'sass:color';

.login-wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bg-color;
  position: relative;
  overflow: hidden;
}

/* 极简网格线：提供秩序感与清单感 */
.grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  // 线条透明度调至 0.03，确保若隐若现不显脏
  background-image:
    linear-gradient(rgba($text-main, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba($text-main, 0.03) 1px, transparent 1px);
  background-size: 45px 45px;
  background-position: center center;
}

.login-card {
  width: 90%;
  max-width: 400px;
  border-radius: $radius-card;
  border: none;
  // 使用更细腻的软阴影
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05) !important;
  position: relative;
  z-index: 1;

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
      @include flex-center;

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
        animation: rotate-ring 6s linear infinite; // 减缓速度，更显沉稳
      }

      .circle-core {
        width: 14px;
        height: 14px;
        background-color: $text-main;
        border-radius: 50%;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
    }

    &:hover .circle-core {
      transform: scale(1.3);
      background-color: $primary-color;
    }

    .brand-title {
      font-size: 32px;
      font-weight: 850; // 增强字重
      color: $text-main;
      margin: 0;
      letter-spacing: -1.5px; // 紧缩字间距，提升设计感
    }

    .brand-subtitle {
      font-size: 13px;
      color: $text-gray;
      opacity: 0.7;
      margin-top: 8px;
    }
  }

  .submit-item {
    margin-top: 32px;
  }

  .submit-btn {
    width: 100%;
    height: 54px;
    background-color: $text-main;
    border: none;
    border-radius: $radius-base;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    @include active-push;

    &:hover {
      background-color: #222;
      box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.4);
      transform: translateY(-2px); // 悬停微浮起
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
      transition: opacity 0.2s;
      &:hover {
        opacity: 0.8;
      }
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
  background-color: rgba($bg-color, 0.5) !important;
  box-shadow: none !important;
  border-radius: $radius-input;
  padding: 10px 18px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;

  &.is-focus {
    background-color: #fff !important;
    border-color: $text-main !important;
    box-shadow: 0 0 0 4px rgba($text-main, 0.05) !important;
  }

  .el-input__inner {
    &::placeholder {
      font-size: 14px;
      color: #bbb;
    }
  }
}
</style>
