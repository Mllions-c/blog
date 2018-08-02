const bunyan = require('bunyan')

class logger {
  constructor ({logger_type, logger_path, logger_level} = {}) {
    this.logger_type = logger_type || 'api'
    this.logger_level = logger_level || 'debug'
    this.logger_path = logger_path
  }
  init () {
    const logger = bunyan.createLogger({
      name: this.logger_type,
      streams: this.createStreams()
    })
    return logger
  }
  createStreams () {
    const streams = [{level: this.logger_level, stream: process.stdout}]
    if (this.logger_path) {
      streams.push({type: 'rotating-file', period: '1d', count: 1, level: this.logger_level, path: this.logger_path})
    }
    return streams
  }
}

module.exports = logger
