<template>
  <div class="auth-wrapper">
    <div class="grid-overlay"></div>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="auth-container" :class="{ 'is-register': !isLogin }">
      <div class="forms-container">
        <div class="form-section login-side">
          <div class="form-content">
            <LoginForm v-if="isLogin" key="login-form" />
          </div>
        </div>

        <div class="form-section register-side">
          <div class="form-content">
            <RegisterForm v-if="!isLogin" key="register-form" @success="isLogin = true" />
          </div>
        </div>
      </div>

      <div class="overlay-container">
        <div class="overlay-slider">
          <div class="panel panel-right">
            <div class="panel-content">
              <div class="dots-guide">
                <span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span>
              </div>
              <h2 class="panel-title">新朋友？</h2>
              <p class="panel-subtitle">加入我们，开始有条不紊的<br />高效生活</p>
              <button class="apple-btn" @click="isLogin = false">快速注册</button>
            </div>
          </div>

          <div class="panel panel-left">
            <div class="panel-content">
              <div class="dots-guide to-left">
                <span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span>
              </div>
              <h2 class="panel-title">欢迎回来</h2>
              <p class="panel-subtitle">今天的任务清单已经准备好了<br />快登录开启吧</p>
              <button class="apple-btn" @click="isLogin = true">直接登录</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

const isLogin = ref(true)
</script>

<style lang="scss" scoped>
$apple-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
$smooth-out: cubic-bezier(0.4, 0, 0.2, 1);
$anim-duration: 0.95s;

.auth-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  @include flex-center;
  background-color: #f5f5f7;
  overflow: hidden;
}

.blob {
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba($primary-color, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
  filter: blur(80px);
  z-index: 0;
  &.blob-1 {
    top: -10%;
    left: -10%;
    animation: blob-float 20s infinite alternate;
  }
  &.blob-2 {
    bottom: -10%;
    right: -10%;
    animation: blob-float 25s infinite alternate-reverse;
  }
}

.auth-container {
  position: relative;
  width: 1000px;
  height: 660px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
  display: flex;
  overflow: hidden;
  z-index: 1;

  .forms-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
  }

  .form-section {
    width: 50%;
    height: 100%;
    @include flex-center;
    transition: all $anim-duration $apple-spring;

    .form-content {
      width: 100%;
      max-width: 380px;
      padding: 0 40px;
    }
  }

  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform $anim-duration $apple-spring;
    z-index: 10;
  }

  .overlay-slider {
    position: relative;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    transition: transform $anim-duration $apple-spring;
  }

  .panel {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    @include flex-center;
    flex-direction: column;
    color: white;
    .panel-content {
      padding: 0 60px;
      // 面板内容的视差位移采用更稳健的曲线
      transition: all $anim-duration $smooth-out;
    }
  }

  .panel-left {
    left: 0;
  }
  .panel-right {
    right: 0;
  }

  // --- 状态切换逻辑优化 ---

  &:not(.is-register) {
    .login-side {
      opacity: 1;
      transform: scale(1);
    }
    .register-side {
      opacity: 0;
      transform: scale(0.95) translateX(30px);
    }
    .panel-right .panel-content {
      opacity: 1;
      transform: translateX(0);
      transition-delay: 0.12s;
    }
    .panel-left .panel-content {
      opacity: 0;
      transform: translateX(-60px);
    }
  }

  &.is-register {
    .overlay-container {
      transform: translateX(-100%);
    }
    .overlay-slider {
      transform: translateX(50%);
    }
    .login-side {
      opacity: 0;
      transform: scale(0.95) translateX(-30px);
    }
    .register-side {
      opacity: 1;
      transform: scale(1);
    }
    .panel-left .panel-content {
      opacity: 1;
      transform: translateX(0);
      transition-delay: 0.12s;
    }
    .panel-right .panel-content {
      opacity: 0;
      transform: translateX(60px);
    }
  }

  .apple-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    color: white;
    padding: 14px 48px;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s $smooth-out;
    @include active-push;
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
    }
  }

  .dots-guide {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 25px;
    .dot {
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      opacity: 0.25;
      animation: dot-glow 2s infinite ease-in-out;
      &.d2 {
        animation-delay: 0.3s;
      }
      &.d3 {
        animation-delay: 0.6s;
      }
    }
    &.to-left {
      flex-direction: row-reverse;
    }
  }

  .panel-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 16px;
    letter-spacing: -1px;
  }
  .panel-subtitle {
    font-size: 15px;
    line-height: 1.8;
    opacity: 0.8;
    margin-bottom: 40px;
  }
}

@keyframes blob-float {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(40px, 80px) scale(1.1);
  }
}

@keyframes dot-glow {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}
</style>
