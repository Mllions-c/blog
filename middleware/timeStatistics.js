exports.timeStatistics = async (ctx, next) => {
  const start = Date.now()
  await next()
  console.log(ctx.req.connection.remoteAddress) // 判断 connection 的远程 IP
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
  ctx.logger.info('req data:', `${ctx.req.connection.remoteAddress}:${ctx.req.method}:${ctx.req.url}:${ms} ms`)
  ctx.logger.info(
    'res data:',
    `${ctx.res.statusCode}:${ctx.response.message}:${ms} ms`
  )
}
