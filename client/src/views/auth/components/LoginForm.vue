<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getErrorMessage } from '@/utils/error'

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
    { min: 6, message: '用户名至少6位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  if (!formRef.value) return

  // 1. 表单预校验
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  // 2. 执行登录
  loading.value = true
  try {
    await userStore.login({
      username: form.username,
      password: form.password,
    })
    ElMessage.success('欢迎回来')
    router.push('/todo')
  } catch (error: unknown) {
    const finalMsg = getErrorMessage(error, '登录失败，请检查账号密码')
    ElMessage.error(finalMsg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-main">
    <div class="header-section">
      <div class="organic-logo">
        <div class="circle-ring"></div>
        <div class="circle-core"></div>
      </div>
      <h1 class="brand-title">欢迎回来</h1>
      <p class="brand-subtitle">简约日程，让生活呼吸顺畅</p>
    </div>

    <el-form ref="formRef" :rules="rules" :model="form" @keyup.enter="handleLogin">
      <el-form-item prop="username" class="stagger-1">
        <el-input
          v-model="form.username"
          placeholder="用户名 (至少6位)"
          size="large"
          class="custom-input"
          clearable
        />
      </el-form-item>

      <el-form-item prop="password" class="stagger-2">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="密码 (至少6位)"
          show-password
          size="large"
          class="custom-input"
          clearable
        />
      </el-form-item>

      <el-form-item class="submit-item stagger-3">
        <el-button type="primary" class="submit-btn" @click="handleLogin" :loading="loading">
          {{ loading ? '正在连接...' : '开始今日清单' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.form-main {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;

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
      border-radius: 50%;
      animation: rotating 6s linear infinite;
    }
    .circle-core {
      width: 12px;
      height: 12px;
      background-color: $text-main;
      border-radius: 50%;
    }
  }

  .brand-title {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
    color: $text-main;
    letter-spacing: -0.5px;
  }
  .brand-subtitle {
    color: $text-gray;
    font-size: 14px;
  }
}

.submit-btn {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: $radius-input;
  margin-top: 10px;
  background-color: $primary-color !important;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  @include active-push;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba($primary-color, 0.2);
  }
}

:deep(.custom-input) {
  .el-input__wrapper {
    background-color: rgba($bg-color, 0.6) !important;
    box-shadow: none !important;
    border: 1.5px solid transparent !important;
    border-radius: $radius-input;
    height: 52px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.is-focus {
      border-color: $primary-color !important;
      background-color: #fff !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba($primary-color, 0.12) !important;
    }
  }
}

.stagger-1 {
  animation: slideUp 0.5s ease forwards 0.1s;
  opacity: 0;
}
.stagger-2 {
  animation: slideUp 0.5s ease forwards 0.2s;
  opacity: 0;
}
.stagger-3 {
  animation: slideUp 0.5s ease forwards 0.3s;
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
</style>
