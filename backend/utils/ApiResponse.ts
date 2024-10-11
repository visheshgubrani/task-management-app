class ApiResponse<T> {
  success: boolean
  message: string
  data?: T | null

  constructor(success = true, message = 'Success', data: T | null = null) {
    this.success = success
    this.message = message
    this.data = data
  }
}

export default ApiResponse
