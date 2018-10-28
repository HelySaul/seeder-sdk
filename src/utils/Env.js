import logger from './logger'
import dotenv from 'dotenv'

class Env {
  static init() {
    return new Promise((resolve, reject) => {
      const inLocalDevelopment = process.env.NODE_ENV === 'development'
      if (inLocalDevelopment) {
        logger.info('Environment: Local Development')
        dotenv.config()
        resolve()
      } else {
        const gcs = require('@google-cloud/storage')()
        const bucketName = 'envvars-smash-prj'
        let remoteFileName
        if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
          logger.info('Environment: Remote Development')
          remoteFileName = 'backend-development.env'
        } else if (process.env.ENVIRONMENT === 'STAGING') {
          logger.info('Environment: Remote Staging')
          remoteFileName = 'backend-staging.env'
        } else if (process.env.ENVIRONMENT === 'PRODUCTION') {
          logger.info('Environment: Remote Production')
          remoteFileName = 'backend-production.env'
        }
        gcs
          .bucket(bucketName)
          .file(remoteFileName)
          .download({ destination: '.env' })
          .then(() => {
            dotenv.config()
            resolve()
          })
          .catch(err => {
            logger.warn(err)
            reject(err)
          })
      }
    })
  }

  static get NODE_ENV() {
    return process.env.NODE_ENV || 'development'
  }

  static get PORT() {
    return process.env.PORT || 3000
  }
  static get DB_HOST() {
    return process.env.DB_HOST || 'localhost'
  }

  static get DB_PORT() {
    return process.env.DB_PORT || 5984
  }

  static get DB_NAME() {
    return process.env.DB_NAME || 'example'
  }
  static get DB_USER() {
    return process.env.DB_USER || 'admin'
  }

  static get DB_PASS() {
    return process.env.DB_PASS || 'pass'
  }

  static get HTTP_LOG_CONFIG() {
    return process.env.HTTP_LOG_CONFIG || 'combined'
  }

  static get SECRET() {
    return process.env.SECRET || 'feracodebr'
  }
}

export default Env
