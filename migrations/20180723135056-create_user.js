'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'users',
      {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        global_id: {type: Sequelize.STRING},
        nick_name: {type: Sequelize.STRING},
        real_name: {type: Sequelize.STRING},
        rank: {type: Sequelize.STRING},
        register_type: {type: Sequelize.STRING},
        age: {type: Sequelize.STRING},
        avatar: {type: Sequelize.STRING},
        username: {type: Sequelize.STRING, allowNull: false, unique: true},
        gender: {type: Sequelize.STRING},
        phone: {type: Sequelize.STRING, unique: true},
        email: {type: Sequelize.STRING, unique: true},
        identity_code: {type: Sequelize.STRING, unique: true},
        created_at: {type: Sequelize.DATE, allowNull: false},
        updated_at: {type: Sequelize.DATE, allowNull: false},
        deleted_at: {type: Sequelize.DATE},
        password: {type: Sequelize.STRING, allowNull: false}
      },
      {
        charset: 'utf8'
      }
    )
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('user')
  }
}
