import jwt from 'jsonwebtoken'
import Env from './Env'

class Token {
  generate(user) {
    const preparedUser = Object.assign({}, user)
    delete preparedUser['config']
    return jwt.sign(preparedUser, Env.SECRET, {})
  }

  httpValidate(req, res, next) {
    const excluded = [
      '/module/system/authenticate/',
      '/module/system/ecommerce/new-user'
    ]

    if (excluded.indexOf(req.url) > -1 || req.method === 'OPTIONS')
      return next()

    const token = req.headers['authorization']
    if (token) {
      jwt.verify(
        token,
        Env.SECRET,
        { ignoreExpiration: true },
        (err, decoded) => {
          if (err) {
            res.status(401).send('invalid token')
          } else {
            req.user = decoded
            next()
          }
        }
      )
    } else {
      res.status(401).send('token not found')
    }
  }

  socketValidate(socket, next) {
    // const excluded = ['/module/system/authenticate/']
    // if (excluded.indexOf(req.url) > -1 || req.method === 'OPTIONS')
    //   return next()

    const socketHandshake = socket.handshake || {}
    const socketHandshakeQuery = socketHandshake.query || {}
    const socketUserToken = socketHandshakeQuery.token

    if (socketUserToken) {
      jwt.verify(
        socketUserToken,
        Env.SECRET,
        { ignoreExpiration: true },
        (err, decoded) => {
          if (err) {
            socket.emit('ontokenstatus', 'error')
            next(err)
          } else {
            socket.emit('ontokenstatus', JSON.stringify(decoded))
            socket.user = decoded
            socket.location = socketHandshakeQuery.location
            next()
          }
        }
      )
    } else {
      //new Error('not authorized')
      next()
    }
  }
}

export default Token
