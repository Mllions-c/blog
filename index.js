const Koa = require('koa')
const app = new Koa()
const logger = require('./app/common/logger')
const KeyGrip = require("keygrip")
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');

app.context.USER = '';
app.context.logger = new logger({logger_path: './log/api.log'}).init()
app.use(async (ctx, next) => {
  
  const start = Date.now()
  await next();
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
  ctx.logger.info('ms:', ms)
})

app.use(async (ctx, next) => {
  ctx.cookies.set('flag', 'api', { signed: true });
  ctx.body = 'Hello World'
  await next()
});

app.on('error', (err, ctx) => {
  ctx.logger.err('server error', err, ctx)
});
module.exports = app