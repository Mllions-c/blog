const Router = require('koa-router');
const router = new Router({prefix: '/v3'})
const common = require('../../common')
router.get('/login', (ctx) => {
  // get user
  // gen token use userId
  const token = jwt.sign({ blog: 'sweet' }, app.keys, { algorithm: 'RS256', expiresIn: 600});
  try {
    
  } catch (err) {
    ctx.logger.console.error(err)
    throw new Error(err)
  }
})

module.exports = function (app) {
  app.use(router.routes(), router.allowedMethods())
}