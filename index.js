const Koa = require('koa')
const app = new Koa()
const logger = require('./app/common/logger')
const KeyGrip = require("keygrip")
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');

app.context.USER = '';
app.context.logger = new logger({logger_path: './log/api.log'}).createLogger()
app.use(async ctx => {
  
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  ctx.logger('ms:', ms)
})

app.use(async ctx => {
  ctx.cookies.set('flag', 'api', { signed: true });
  ctx.body = 'Hello World'
});

app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});
module.exports = app