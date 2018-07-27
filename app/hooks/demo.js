module.exports = function (db) {
    db.User.addHook('afterCreate', 'createDynamic', function (instance, options) {
      console.log('afterCreate')
    })
  }
  