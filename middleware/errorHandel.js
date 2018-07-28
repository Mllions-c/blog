exports.errorHandel = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      ctx.body = {message: error.stack}
    } else {
      ctx.body = '网络不好,请稍后'
    }
  }
}
