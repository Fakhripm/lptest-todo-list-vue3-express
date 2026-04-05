<script setup lang="ts">
import { ref, reactive } from 'vue'
import { register as registerApi } from '@/api/auth'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getErrorMessage } from '@/utils/error'

const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

// 修复 eslint 的 any 报错：将 _rule 类型设为 unknown
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

// 注册校验规则
const rules: FormRules = {
  username: [
    { required: true, message: '请设置用户名', trigger: 'blur' },
    { min: 6, message: '用户名至少6位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  if (!formRef.value) return

  // 1. 纯前端表单格式校验
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  // 2. 提交注册请求
  loading.value = true
  try {
    await registerApi({
      username: form.username,
      password: form.password,
    })
    ElMessage.success('账号创建成功，请登录')
    emit('success')
  } catch (error: unknown) {
    if (error !== 'cancel') {
      const finalMsg = getErrorMessage(error, '注册失败，请稍后再试')
      ElMessage.error(finalMsg)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-main">
    <div class="header-section">
      <h1 class="brand-title">开启旅程</h1>
      <p class="brand-subtitle">只需几秒，建立你的专属清单</p>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" @keyup.enter="handleRegister">
      <el-form-item prop="username" class="stagger-1">
        <el-input
          v-model="form.username"
          placeholder="设置用户名 (至少6位)"
          size="large"
          class="custom-input"
          clearable
        />
      </el-form-item>

      <el-form-item prop="password" class="stagger-2">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="设置密码 (至少6位)"
          show-password
          size="large"
          class="custom-input"
          clearable
        />
      </el-form-item>

      <el-form-item prop="confirmPassword" class="stagger-3">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="确认密码"
          show-password
          size="large"
          class="custom-input"
          clearable
        />
      </el-form-item>

      <el-form-item class="submit-item stagger-4">
        <el-button type="primary" class="submit-btn" @click="handleRegister" :loading="loading">
          {{ loading ? '正在创建...' : '立即加入' }}
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
  .brand-title {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
    color: $text-main;
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
    &.is-focus {
      border-color: $primary-color !important;
      background-color: #fff !important;
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
.stagger-4 {
  animation: slideUp 0.5s ease forwards 0.4s;
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
</style>
