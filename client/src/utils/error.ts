export function getErrorMessage(error: unknown, defaultMsg: string = '操作失败'): string {
  if (typeof error === 'string') return error

  if (!error || typeof error !== 'object') return defaultMsg

  const errObj = error as {
    response?: {
      data?: {
        message?: string
        msg?: string
      }
    }
    message?: string
  }

  return (
    errObj.response?.data?.message || errObj.response?.data?.msg || errObj.message || defaultMsg
  )
}
