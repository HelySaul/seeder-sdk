import NodeCouchDb from 'node-couchdb'
import Env from './Env'
import logger from './logger'

class Database {
  static async connect() {
    const dbConnection = new NodeCouchDb({
      host: Env.DB_HOST,
      port: Env.DB_PORT,
      auth: {
        user: Env.DB_USER,
        pass: Env.DB_PASS
      },
      timeout: 30000 //30 seconds
    })
    await dbConnection
      .listDatabases()
      .then(() => {
        logger.info(`DB found on server ${Env.DB_HOST}:${Env.DB_PORT} `)
        logger.info(
          `Database server: ${Env.DB_HOST}, DB: ${Env.DB_NAME} on port ${
            Env.DB_PORT
          } `
        )
      })
      .catch(err => Database.reconnect(err))
    return dbConnection
  }

  /*
    Usage:

    const updatedData = await Database.updateDb(
      this.couchDb,
      'smashdbbackup',
      { _id: '55d2e81a0958a1c76bbded72c2000f1d', age: 41 },
      true
    )
    res.status(200).send(updatedData.data)
   */
  static async updateDb(couchDb, databaseName, object, partial = false) {
    if (!object._id) {
      throw new Error('Field "_id" is required')
    }
    let objectToUpdate = object
    if (!objectToUpdate._rev || partial) {
      const currentObj = await couchDb.get(databaseName, object._id)
      objectToUpdate = Object.assign(currentObj.data, object)
    }
    return await couchDb.update(databaseName, objectToUpdate)
  }  

  static async reconnect(err) {
    logger.error(`Database not found: ${err}, trying to find in 3 seconds...`)
    setTimeout(async () => await Database.connect(), 3000)
  }
}

export default Database
