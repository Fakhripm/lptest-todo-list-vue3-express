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

        <el-form ref="formRef" :rules="rules" :model="form" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
              class="custom-input"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
              size="large"
              class="custom-input"
              clearable
            />
          </el-form-item>

          <el-form-item class="submit-item">
            <el-button type="primary" class="submit-btn" @click="handleLogin" :loading="loading">
              开始今日清单
            </el-button>
          </el-form-item>
        </el-form>

        <div class="footer-section">
          <span class="hint-text">还没有加入？</span>
          <el-link underline="never" class="register-link" @click="router.push('/register')"
            >立即注册</el-link
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少三位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少六位', trigger: 'blur' },
  ],
}

// 4. 登录逻辑
const handleLogin = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    await userStore.login({
      username: form.username,
      password: form.password,
    })

    ElMessage.success('欢迎回来!')
    router.push('/todo')
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '登录失败了, 请检查账号密码'
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
// 基础容器
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

// 网格背景
.grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba($text-main, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba($text-main, 0.03) 1px, transparent 1px);
  background-size: 45px 45px;
  background-position: center center;
}

// 卡片样式
.login-card {
  width: 90%;
  max-width: 400px;
  border-radius: $radius-card;
  border: none;
  // 优化：使用变量定义的阴影
  box-shadow: $shadow-mid !important;
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
        animation: rotating 6s linear infinite;
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
      font-weight: 850;
      color: $text-main;
      margin: 0;
      letter-spacing: -1.5px; // 保持紧凑感
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
    border: none;
    // 方案 A：由 $text-main 改为 $primary-color
    background-color: $primary-color !important;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    border-radius: $radius-input;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 10px;

    &:hover {
      background-color: color.adjust($primary-color, $lightness: -8%) !important;
      // 方案 A：使用品牌蓝扩散阴影
      box-shadow: 0 10px 20px -10px color.change($primary-color, $alpha: 0.4);
      transform: translateY(-2px);
    }

    &.is-loading {
      opacity: 0.7;
      background-color: $primary-color !important;
      cursor: not-allowed;
      transform: translateY(0);

      :deep(.el-icon) {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.9);
        animation: rotating 1.5s linear infinite;
      }
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

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 输入框统一样式优化
:deep(.custom-input) {
  .el-input__wrapper {
    background-color: rgba($bg-color, 0.5) !important;
    box-shadow: none !important;
    border-radius: $radius-input;
    padding: 10px 18px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.25s ease;

    &.is-focus {
      background-color: #fff !important;
      // 方案 A：聚焦边框改为品牌蓝
      border-color: $primary-color !important;
      // 方案 A：外发光改为品牌蓝透明度
      box-shadow: 0 0 0 4px color.change($primary-color, $alpha: 0.1) !important;
    }

    .el-input__inner {
      &::placeholder {
        font-size: 14px;
        color: #bbb;
      }
    }
  }
}
</style>
