export function getErrorMessage(error: unknown, defaultMsg: string = '操作失败'): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return defaultMsg
}
