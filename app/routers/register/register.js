const Router = require('koa-router')
const router = new Router({prefix: '/v3'})
const {register} = require('../../service/register/register')
/**
 *注册路由
 */
router.post('/register', register)

module.exports = function (app) {
  app.use(router.routes(), router.allowedMethods())
}
