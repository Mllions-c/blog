const jwt = require('jsonwebtoken')
const common = require('../../common')
const login = async (ctx) => {
  const {password, userId: id} = ctx.request.body
  try {
    const User = ctx.db.User
    const user = await User.scope('all').findById(id)
    console.log(user, 'user')
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
    ctx.body = common.success({username: user.username, token})
  } catch (err) {
    ctx.logger.error(err)
    throw new Error(err)
  }
}
module.exports = {
  login: login
}
