const Router = require('koa-router')
const router = new Router({prefix: '/v3'})
const jwt = require('jsonwebtoken')
const common = require('../../common')
router.get('/login', (ctx) => {
  const {usename, password, userId: id} = ctx.body
  try {
    const user = ctx.db.user.findById(id)
    if (!user) throw new Error('账号不存在')
    if (!user.verifyPassword(password)) throw new Error('密码错误')
    const keys = Math.random()
      .toString(36)
      .substring(2)
    const token = jwt.sign({ global_id: user.global_id }, keys, {
      expiresIn: 5 * 60
    })
    ctx.logger.info('token:', token)
    ctx.redis.setExpire(`${user.id}:token`, token, 5 * 60)
    ctx.body = common.success({usename, token})
  } catch (err) {
    ctx.logger.error(err)
    throw new Error(err)
  }
})

module.exports = function (app) {
  app.use(router.routes(), router.allowedMethods())
}
