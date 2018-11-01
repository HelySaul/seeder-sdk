import logger from './logger'

class GoogleStorage {

  static async uploadFile(bucket, userId, fileName, file) {
    return new Promise((resolve, reject) => {
      try {
        const bucketFile = bucket.file(`${userId}/${fileName}`)
        const stream = bucketFile.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        })
        stream.on('error', err => {
          bucketFile.cloudStorageError = err
          logger.error('Error uploading file : ' + JSON.stringify(err))
          reject(err)
        })
        stream.on('finish', par1 => {
          bucketFile.cloudStorageObject = fileName
          //return bucketFile.makePublic().then(() => {
          //bucketFile.gcsUrl = `https://storage.googleapis.com/smash-profile-file/${userId}/{fileName}`
          resolve()
          //})
        })
        stream.end(file.data)
      } catch (error) {
        reject(error)
        logger.error('Error uploading file : ' + JSON.stringify(error))
      }
    })
  }

}

export default GoogleStorage