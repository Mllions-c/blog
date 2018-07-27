exports.errorHandel = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      ctx.logger.error(err);
      ctx.body = err;
    } else {
      ctx.logger.error("网络不好,请稍后");
      ctx.body = "网络不好,请稍后";
    }
  }
};
