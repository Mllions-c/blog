const Koa = require('koa')
const koaBody = require('koa-body')
const helmet = require('koa-helmet')
const logger = require('./app/common/logger')
const redisService = require('./util/redisService')
const KeyGrip = require("keygrip")
const app = new Koa()
const routes = require('./app/routers')
const db = require('./app/models')
const Promise = require('bluebird')
const redis = Promise.promisifyAll(require('./app/common/redis'))
const {timeStatistics, errorHandel} = require('./middleware/index')
try {
  app.context.logger = new logger({logger_path: './log/api.log'}).init()
  app.context.logger.info(`use env:${process.env.NODE_ENV}`)
  app.context.db = db
  app.context.redis = new redisService(redis)
  app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256')
  console.log(timeStatistics.timeStatistics, 'timeStatistics=======')
  app.use(errorHandel)
  app.use(timeStatistics)
  // 安全策略
  app.use(helmet())
  // 类似于expree 的bodyparser,用于解析各种类型数据
  app.use(koaBody());
  app.use(async (ctx, next) => {
    ctx.cookies.set('flag', 'api', { signed: true })
    await next()
  })
  
  new routes(app).start()
  
  app.on('error', (err, ctx) => {
    ctx.logger.error(err)
  })
} catch (err) {
  console.error('index error:', err)
  process.exit(1)
}

module.exports = app