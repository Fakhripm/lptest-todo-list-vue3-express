<template>
  <div class="register-wrapper">
    <div class="grid-overlay"></div>

    <el-card class="register-card" shadow="always">
      <div class="register-content">
        <div class="header-section">
          <div class="organic-logo">
            <div class="circle-ring"></div>
            <div class="circle-core"></div>
          </div>
          <h1 class="brand-title">加入 TodoList</h1>
          <p class="brand-subtitle">开启高效、轻盈的日程管理之旅</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" @keyup.enter="handleRegister">
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请设置用户名 (至少3位)"
              size="large"
              class="custom-input"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请设置密码 (至少6位)"
              show-password
              size="large"
              class="custom-input"
              clearable
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次确认密码"
              show-password
              size="large"
              class="custom-input"
              clearable
            />
          </el-form-item>

          <el-form-item class="submit-item">
            <el-button type="primary" class="submit-btn" :loading="loading" @click="handleRegister">
              创建我的账号
            </el-button>
          </el-form-item>
        </el-form>

        <div class="footer-section">
          <span class="hint-text">已有账号？</span>
          <el-link underline="never" class="login-link" @click="goToLogin"> 立即登录 </el-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { register } from '@/api/auth'
import { getErrorMessage } from '@/utils/error'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

// 自定义校验：两次密码是否一致
const validateConfirmPassword = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度 3-20 位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

const goToLogin = () => {
  router.push('/login')
}

const handleRegister = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    await register({
      username: form.username,
      password: form.password,
    })

    ElMessage.success('注册成功！即将跳转登录页...')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error: unknown) {
    // 1. 定义后端响应的结构类型（避免使用 any）
    interface BackendError {
      response?: {
        data?: {
          message?: string
        }
      }
    }

    // 2. 尝试提取后端返回的具体业务错误 (如 "用户名已存在")
    const err = error as BackendError
    const serverMessage = err.response?.data?.message

    // 3. 调用你的工具函数
    // 如果 serverMessage 有值，传给 getErrorMessage 会走 string 分支返回该值
    // 如果没有，则传原 error 对象走实例分支
    const finalMsg = getErrorMessage(serverMessage || error, '注册失败，请重试')

    ElMessage.error(finalMsg)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bg-color;
  position: relative;
  overflow: hidden;
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
  background-position: center center;
}

.register-card {
  width: 90%;
  max-width: 420px;
  border-radius: $radius-card;
  border: none;
  box-shadow: $shadow-mid !important;
  position: relative;
  z-index: 1;

  :deep(.el-card__body) {
    padding: 50px 45px;
  }
}

.register-content {
  .header-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;

    .organic-logo {
      position: relative;
      width: 48px;
      height: 48px;
      margin-bottom: 20px;
      @include flex-center; // 修正：移除 mix. 前缀

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
      font-size: 28px;
      font-weight: 850;
      color: $text-main;
      margin: 0;
      letter-spacing: -1px;
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
    background-color: $primary-color !important; // 统一为品牌蓝
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    border-radius: $radius-input;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    @include active-push; // 修正：移除 mix. 前缀

    &:hover {
      background-color: color.adjust($primary-color, $lightness: -8%) !important;
      box-shadow: 0 10px 20px -10px color.change($primary-color, $alpha: 0.4);
      transform: translateY(-2px);
    }
  }

  .footer-section {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 6px;
    font-size: 14px;

    .hint-text {
      color: $text-gray;
    }

    .login-link {
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

// 输入框样式统一
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
      border-color: $primary-color !important; // 统一为品牌蓝聚焦色
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
