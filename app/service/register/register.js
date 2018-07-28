const common = require('../../common')
const jwt = require('jsonwebtoken')

const register = async ctx => {
  const {
    global_id,
    nick_name,
    real_name,
    register_type,
    age,
    avatar,
    username,
    gender,
    phone,
    email,
    identity_code,
    password
  } = ctx.request.body
  const keys = Math.random()
    .toString(36)
    .substring(2)
  try {
    const user = await ctx.db.User.create({
      nick_name,
      real_name,
      register_type,
      age,
      avatar,
      username,
      gender,
      phone,
      email,
      identity_code,
      password,
      global_id
    })
    const token = jwt.sign({ global_id: user.global_id }, keys, {
      expiresIn: 5 * 60
    })
    ctx.redis.setExpire(`${user.id}:token`, token, 5 * 60)
    ctx.body = common.success({token: token})
  } catch (err) {
    ctx.logger.error(err)
    throw err
  }
}

module.exports = {
  register: register
}
