'use strict'

const fs = require('fs')
const _logger = require('../common/logger.js')
const logger = new _logger({logger_path: './log/db.log',logger_type: 'db'}).init()
const path = require('path')
const Sequelize = require('sequelize')
// require('sequelize-hierarchy')(Sequelize)
const basename = path.basename(module.filename)
const {database='blog', username='sweet', password='123456yy'} = require('config')
const config = require('config')
const _config = config.get('db')
const hooks = require('../hooks')
// 重写logging
_config['logging'] = function (sql, latency) {
  // const requestId = ns.get('requestId')
  const info = {sql, instance: latency.instance}
  info.type = 'sql'
  logger.info(info)
}

const sequelize = new Sequelize(database, username, password, _config)
sequelize
    .authenticate()
    .then(() => {
        logger.info('PG connection has been established successfully.')
    })
    .catch((err) => {
        logger.error('Unable to connect to the database:', err)
    })
const db = {}
// fix bug 
let oldAggregate = sequelize.Model.prototype.aggregate
sequelize.Model.prototype.aggregate = function (attribute, aggregateFunction, options) {
  if (options.col) {
    return oldAggregate.apply(this, [options.col, aggregateFunction, options])
  } else {
    return oldAggregate.apply(this, [attribute, aggregateFunction, options])
  }
}
function initModel(filePath) {
    const model = sequelize['import'](filePath)
    db[model.name] = model
}
function readFile(fileName, dirname) {
    const filePath = path.join(dirname, fileName)
    if (fileName.indexOf('.') === -1 && fs.statSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach((file) => {
            readFile(file, filePath)
        })
    } else if (fileName.endsWith('.js') && (fileName !== basename)) {
        initModel(filePath)
    }
}

readFile('', __dirname)

Object.keys(db).forEach((modelName) =>{
    if ('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
hooks(db)
module.exports = db
