'use strict'
var crypto = require('crypto')
var validate = require('../../common/sqlValidate')
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV1},
    real_name: {type: DataTypes.STRING, allowNull: true, comment: '真实姓名'},
    gender: {type: DataTypes.ENUM('male', 'female'), comment: '性别'},
    age: {type: DataTypes.STRING, comment: '年龄'},
    avatar: {type: DataTypes.STRING, comment: '头像'},
    phone: {type: DataTypes.STRING, validate: validate.isPhone, unique: true, comment: '手机号码'},
    position: {type: DataTypes.STRING, comment: '担任职位'},
    username: {type: DataTypes.STRING, allowNull: false, unique: true, comment: '登录员帐号名'},
    email: {type: DataTypes.STRING, unique: true, comment: 'Email'},
    phoneAuth: {type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否认证'},
    emailAuth: {type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否认证'},
    key: {type: DataTypes.UUID, comment: '邮箱认证key值'},
    identity_code: {type: DataTypes.STRING, comment: '身份证号'},
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '加密后的密码',
      set: function (val) {
        var username = this.getDataValue('username')
        var shadow = crypto.createHash('md5').update(val.toLowerCase() + username).digest('hex').toUpperCase()
        this.setDataValue('password', shadow)
      }
    }
  },
  {
    paranoid: true,
    underscored: true,
    classMethods: {
      associate: function (models) {
        // associations can be defined here
        User.belongsTo(models.Organization, {as: 'originalOrganization', foreignKey: 'original', comment: '原始所属'})
      }
    },
    defaultScope: {
      attributes: ['id']
    },
    instanceMethods: {
      verifyPassword: function (password) {
        var username = this.getDataValue('username')
        var shadow = crypto.createHash('md5').update(password.toLowerCase() + username).digest('hex').toUpperCase()
        return this.getDataValue('password') === shadow
      }
    },
    scopes: {
      condition: function (params) {
        var where = {}
        if (params) {
          if (params['real_name']) {
            where['real_name'] = {like: '%' + params['real_name'].value[0] + '%'}
          }
        }
        return {
          where: where
        }
      }
    }
  })
  return User
}
