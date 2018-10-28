class ApiError extends Error {
  constructor(name, message, status) {
    super(message)

    this.name = name

    Error.captureStackTrace(this, this.constructor)
    this.status = status || 500
  }
}

export default ApiError
