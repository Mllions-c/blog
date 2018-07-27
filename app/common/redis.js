const redis = require('redis')
const _config = require('config')
const _logger = require('./logger')
const logger = new _logger({logger_path: './log/api.log', logger_type: 'redis'}).init()
const Promise = require('bluebird')
const config = _config.get('redis')
// var env = process.env.NODE_ENV || 'production';
var retryStrategy = function (options) {
  if (options.error && options.error.code === 'ECONNREFUSED') {
    // return new Error('The server refused the connection')
    logger.info('connection refused');
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    return new Error('Retry time exhausted')
  }
  if (options.attempt > 100) {
    report('attempt more than 100');
    return undefined
  }
  let len = Math.min(options.attempt * 100, 3000)
  return len
}
const client = redis.createClient(config.port, config.host, {connect_timeout: 99999, retry_strategy: retryStrategy })
client.on('connect', () => {
  logger.info('Redis client connected')
  })
client.on('error', (err) => {
  logger.error('Redis Error: ', err)
})
client.on('disconnect', (err) => {
  logger.error('redis disconnected', err)
})

module.exports = client
