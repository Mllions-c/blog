const Router = require('koa-router')
const router = new Router({prefix: '/v3'})
const {login} = require('../../service/login/login')
router.post('/login', login)

module.exports = function (app) {
  app.use(router.routes(), router.allowedMethods())
}
