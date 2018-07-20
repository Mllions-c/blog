module.exports = function (db) {
    db.User.addHook('afterCreate', 'createDynamic', function (instance, options) {
      let opt_user = JSON.stringify(
        [
          {model: 'User', id: options.user.id, name: options.user.real_name},
          {model: 'Organization', id: options.user.currentOrganization.id, name: options.user.currentOrganization.name}
        ]
      )
      let target = JSON.stringify({model: 'Factoring', id: instance.id, name: instance.code})
      let opt = 'create'
      let dynamic = db.FactoringDynamic.build({
        opt_user,
        opt,
        target,
        factoring_id: instance.id
      })
      return dynamic.save({transaction: options.transaction})
    })
  }
  