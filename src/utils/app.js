import express from 'express'
import morgan from 'morgan'
import { json, urlencoded } from 'body-parser'
import logger from './logger'
import Env from './Env'
import Token from './Token'
import fileUpload from 'express-fileupload'

const app = express()
const token = new Token()

const whitelist = ['http://192.168.86.22:4200', 'http://192.168.86.35:4200', 'https://developferacode.smashtechnology.com']    
const options = {
  origin: function (origin, callback) {
    logger.info(origin)

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}    

app
  .use(morgan(Env.HTTP_LOG_CONFIG, { stream: logger.stream }))

  //.use(cors())    

  .use((req, res, next) => {
    // To use with websocket, uncomment this line below and comment the next line
    res.header('Access-Control-Allow-Origin', req.headers.origin)
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
