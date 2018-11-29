import express from 'express'
import morgan from 'morgan'
import { json, urlencoded } from 'body-parser'
import logger from './logger'
import Env from './Env'
import Token from './Token'
import fileUpload from 'express-fileupload'

const app = express()
const token = new Token()

app
  .use(morgan(Env.HTTP_LOG_CONFIG, { stream: logger.stream }))
  .use((req, res, next) => {
    // To use with websocket, uncomment this line below and comment the next line
    res.header('Access-Control-Allow-Origin', req.headers.origin + ', http://192.168.86.22:4200')
    //res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })
  .use(token.httpValidate)
  .use(json({ limit: '5mb' }))
  .use(
    urlencoded({
      limit: '5mb',
      extended: false
    })
  )
  .use(fileUpload())

export default app
