import { ElMessageBox } from 'element-plus'

type ModernConfirmOptions = {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'success' | 'info' | 'warning' | 'error'
}

type ModernPromptOptions = {
  title: string
  message?: string
  inputValue?: string
  inputPlaceholder?: string
  inputValidator?: (value: string) => boolean | string
  confirmText?: string
  cancelText?: string
}

/**
 * 统一现代风格确认框（你的 modern-confirm-box）
 */
export const useModernConfirm = async (options: ModernConfirmOptions = {}) => {
  const {
    title = '提示',
    message = '',
    confirmText = '确定',
    cancelText = '取消',
    type = 'warning',
  } = options

  return ElMessageBox.confirm(message, title, {
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    type,
    customClass: 'modern-confirm-box',
    showClose: false,
    distinguishCancelAndClose: true, // 重要：让 cancel 返回 'cancel'
  })
}

/**
 * 统一现代风格输入框（你的 prompt）
 */
export const useModernPrompt = async (options: ModernPromptOptions) => {
  const {
    title,
    message = '',
    inputValue = '',
    inputPlaceholder = '请输入...',
    inputValidator,
    confirmText = '保存',
    cancelText = '取消',
  } = options

  const promptPromise = ElMessageBox.prompt(message, title, {
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    inputValue,
    inputPlaceholder,
    inputValidator,
    customClass: 'modern-confirm-box',
    showClose: false,
    distinguishCancelAndClose: true,
  })

  // 自动聚焦 + 全选（保持你原来的体验）
  setTimeout(() => {
    const input = document.querySelector(
      '.modern-confirm-box .el-input__inner',
    ) as HTMLInputElement | null
    if (input) {
      input.focus()
      input.select()
    }
  }, 10)

  return promptPromise
}
