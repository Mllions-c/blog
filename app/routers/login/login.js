const Router = require('koa-router');
const router = new Router( {prefix: '/v3'})
const common = require('../../common')
router.get('/login', (ctx) => {
  ctx.body = common.success("login")
})

module.exports = function (app) {
  app.use(router.routes(), router.allowedMethods())
}