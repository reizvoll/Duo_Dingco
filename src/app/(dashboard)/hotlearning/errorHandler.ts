import Error from 'next/error'

export function handleError(error: unknown): string {
  if (error instanceof Error) {
    console.error('Error:', error.message)
    return error.message
  }
  console.error('Unknown Error:', error)
  return '알 수 없는 에러가 발생했습니다.'
}
