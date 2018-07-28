const fs = require('fs')
const path = require('path')
const basename = path.basename(module.filename)
const selfModels = {}

function requireFile (filePath, fileName) {
  const _fileName = path.basename(fileName, '.js')
  selfModels[_fileName] = require(filePath)[_fileName]
}

function readFile (fileName, dirname) {
  var filePath = path.join(dirname, fileName)

  if (fileName.indexOf('.') === -1 && fs.statSync(filePath).isDirectory()) {
    fs.readdirSync(filePath).forEach(function (file) {
      readFile(file, filePath)
    })
  } else if (fileName.endsWith('.js') && fileName !== basename) {
    requireFile(filePath, fileName)
  }
}

readFile('', __dirname)
module.exports = selfModels
