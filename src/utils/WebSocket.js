import http from 'http'
import socketIO from 'socket.io'
import Token from './Token'

class WebSocket {
  constructor(app) {
    this.webSocketClients = {}
    const token = new Token()

    this.httpServer = http.createServer(app)
    this.webSocketServer = socketIO(this.httpServer)
    this.webSocketServer.use(token.socketValidate)
  }

  addClient(groupName, userId, socketClient) {
    const groupWebSockets = this.webSocketClients[groupName] || {}
    const userWebSockets = groupWebSockets[userId] || []
    userWebSockets.push(socketClient)
    groupWebSockets[userId] = userWebSockets
    this.webSocketClients[groupName] = groupWebSockets
  }

  removeClient(groupName, userId, socketClient) {
    const groupWebSockets = this.webSocketClients[groupName] || {}
    const userWebSockets = groupWebSockets[userId] || []
    this.webSocketClients[groupName][userId] = userWebSockets.filter(
      userWebSocket => {
        return userWebSocket !== socketClient
      }
    )
  }

  emit(groupName, userId, eventName, object) {
    const groupWebSockets = this.webSocketClients[groupName] || {}
    const userWebSockets = groupWebSockets[userId] || []

    userWebSockets.forEach(userWebSocket => {
      userWebSocket.emit(eventName, object)
    })
  }

  broadcast(groupName, socketClientSource, eventName, object) {
    const groupWebSockets = this.webSocketClients[groupName] || {}
    const userIds = Object.keys(groupWebSockets)

    userIds.forEach(userId => {
      const userWebSockets = groupWebSockets[userId] || []
      userWebSockets.forEach(userWebSocket => {
        if (userWebSocket !== socketClientSource) {
          userWebSocket.emit(eventName, object)
        }
      })
    })
  }
}

export default WebSocket
