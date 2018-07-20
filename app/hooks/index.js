var fs = require('fs')
var path = require('path')
var basename = path.basename(module.filename)

module.exports = function (db) {
  function requireFile (filePath) {
    var hooks = require(filePath)
    hooks(db)
  }

  function readFile (fileName, dirname) {
    var filePath = path.join(dirname, fileName)

    if (fileName.indexOf('.') === -1 && fs.statSync(filePath).isDirectory()) {
      fs.readdirSync(filePath)
        .forEach(function (file) {
          readFile(file, filePath)
        })
    } else if ((fileName.indexOf('.js') > 0) && (fileName !== basename)) {
      requireFile(filePath)
    }
  }

  readFile('', __dirname)
}
