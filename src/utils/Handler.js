import logger from './logger'
import ApiError from './ApiError'

class Handler {
  async error(error, req) {
    logger.error(
      `${new Date()} - ${req.method} - ${req.url} - ${error.message}`
    )
    return error
  }

  async checkOwner(req, object) {
    if (req.user._id === object.owner) return object
    throw new ApiError('QueryError', 'Object Not Found', 403)
  }
}

export default Handler
