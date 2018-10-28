import nodemailer from 'nodemailer'
import logger from './logger'

class Notification {
  constructor(login, pass) {
    // this.mailLogin = login 
    // this.mailPass = pass
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: login,
        pass: pass
      }
    })
  }

  send(option) {
    Object.assign(option, { from: 'dev@feracode.com' })
    return this.transporter.sendMail(
      option,
      (err, info) =>
        info
          ? logger.info(`Info: ${info.response}`)
          : logger.error(`Error: ${err}`)
    )
  }
}

export default Notification
