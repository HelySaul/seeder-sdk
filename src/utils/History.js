import moment from 'moment'
import logger from './logger'

class History {
  add(dbConnection, dbName, owner, regarding, webSocket, webSocketGroupName) {
    const historyObj = {
      type: 'profile-history',
      owner,
      dateTime: moment().utc(),
      regarding
    }
    dbConnection
      .insert(dbName, historyObj)
      .then(data => {
        webSocket.emit(
          webSocketGroupName,
          owner,
          `/${webSocketGroupName}/history`,
          historyObj
        )
      })
      .catch(error => logger.error(`Error adding history: ${error}`))
  }
}

export default History
