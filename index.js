const Koa = require('koa')
const logger = require('./app/common/logger')
const KeyGrip = require("keygrip")
const app = new Koa()
const routes = require('./app/routers')
const db = require('./app/models')

app.context.logger = new logger({logger_path: './log/api.log'}).init()
app.context.logger.info(`use env:${process.env.NODE_ENV}`)
app.context.db = db
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
  ctx.logger.info('req data:', `${ctx.req.method}:${ctx.req.url}:${ms} ms`)
  ctx.logger.info('res data:', `${ctx.res.statusCode}:${ctx.response.message}:${ms} ms`)
})

app.use(async (ctx, next) => {
  ctx.cookies.set('flag', 'api', { signed: true })
  await next()
})

new routes(app).start()

app.on('error', (err, ctx) => {
  ctx.logger.error('server error', err, ctx)
})

module.exports = app
// ctx.throw(401, 'access_denied', { user: user });
// ctx.assert(ctx.state.user, 401, 'User not found. Please login!');