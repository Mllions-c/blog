const Router = require('koa-router');
const fs = require('fs')
const path =require('path')
const basename = path.basename(module.filename)
const common = require('../common')
const router = new Router()

class InitRouter {
  constructor(app) {
    this.app = app
  }
  start() {
    this.readFile('', __dirname)
  }
   requireFile (filePath) {
    const routers = require(filePath)
    routers(this.app)
    this.app.context.logger.info('router init success')
  }
  
   readFile (fileName, dirname) {
     // const self = this
    var filePath = path.join(dirname, fileName)
  
    if (fileName.indexOf('.') === -1 && fs.statSync(filePath).isDirectory()) {
      fs
        .readdirSync(filePath)
        .forEach((file) => {
          this.readFile(file, filePath)
        })
    } else if (fileName.endsWith('.js') && (fileName !== basename)) {
      this.requireFile(filePath)
    }
  }
}


module.exports = InitRouter
  