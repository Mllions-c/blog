const Koa = require('koa')
const koaBody = require('koa-body')
const helmet = require('koa-helmet')
const Logger = require('./app/common/logger')
const RedisService = require('./util/redisService')
const KeyGrip = require('keygrip')
const app = new Koa()
const cors = require('koa-cors')
const Routes = require('./app/routers')
const db = require('./app/models')
const corsWhitelist = require('./cors-list')
const Promise = require('bluebird')
const redis = Promise.promisifyAll(require('./app/common/redis'))
const {timeStatistics, errorHandel} = require('./middleware/index')
try {
  app.context.logger = new Logger({logger_path: './log/api.log'}).init()
  app.context.logger.info(`use env:${process.env.NODE_ENV}`)
  app.context.db = db
  app.context.redis = new RedisService(redis)
  app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256')
  app.use(errorHandel)
  app.use(timeStatistics)
  app.use(koaBody({multipart: true}))
  const corsOptions = {
    origin: corsWhitelist,
    credentials: true
  }
  app.use(cors(corsOptions))

  // 安全策略
  app.use(helmet())

  app.use(async (ctx, next) => {
    ctx.cookies.set('flag', 'api', { signed: true })
    await next()
  })

  app.on('error', (err, ctx) => {
    ctx.logger.error(err)
  })
  new Routes(app).start()
} catch (err) {
  console.error('index error:', err)
  process.exit(1)
}

module.exports = app
