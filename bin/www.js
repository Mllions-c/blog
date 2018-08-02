const app = require('../index')
const http = require('http')
const https = require('https')
const Alphabet = require('../util/console/console.js')
http.createServer(app.callback()).listen(1992)
https.createServer(app.callback()).listen(1991)
const _logger = require('../app/common/logger.js')

async function restartLoggingRecord (params) {
  const logger = new _logger().init()
  const LAST_RECORD = await app.context.redis.get('record')
  await app.context.redis.set('record', Number(LAST_RECORD) + 1)
  logger.info(Alphabet((Number(LAST_RECORD) + 1).toString(), 'stereo'))
  process.on('uncaughtException', (error) => {
    logger.error(error, 'uncaughtException')
  })
}
try {
  restartLoggingRecord()
} catch (e) {
  console.log('www error:', e)
}
