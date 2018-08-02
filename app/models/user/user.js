'use strict'
const crypto = require('crypto')
const validate = require('../../../util/validate/sqlValidate')
const uuidv4 = require('uuid/v4')
const _ = require('lodash')
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4},
    real_name: {type: DataTypes.STRING, comment: '真实姓名'},
    nick_name: {type: DataTypes.STRING, comment: '昵称'},
    rank: {type: DataTypes.STRING, comment: '会员等级'},
    gender: {type: DataTypes.ENUM('male', 'female'), comment: '性别'},
    age: {type: DataTypes.STRING, comment: '年龄'},
    register_type: {type: DataTypes.STRING, comment: '注册类型'},
    avatar: {type: DataTypes.STRING, comment: '头像'},
    phone: {type: DataTypes.STRING, validate: validate.isPhone, unique: {args: true, msg: 'phone already exists'}, comment: '手机号码'},
    username: {type: DataTypes.STRING, allowNull: false, unique: {args: true, msg: 'username already exists'}, comment: '登录员帐号名'},
    email: {type: DataTypes.STRING, unique: {args: true, msg: 'email already exists'}, comment: 'Email'},
    identity_code: {type: DataTypes.STRING, comment: '身份证号'},
    global_id: {
      type: DataTypes.STRING,
      comment: ' 全球唯一id',
      set: function () {
        const _value1 = uuidv4().replace(/-/g, '').slice(2, 16).toUpperCase()
        _.capitalize(_value1)
        this.setDataValue('global_id', _value1)
      }
    },
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
    tableName: 'users',
    classMethods: {
      associate: function (models) {
        User.addScope('basic', {
          attributes: ['id', 'global_id', 'username']
        })
      }
    },
    defaultScope: {
      attributes: ['id', 'global_id', 'username']
    },
    instanceMethods: {
      verifyPassword: function (password) {
        var username = this.getDataValue('username')
        var shadow = crypto.createHash('md5').update(password.toLowerCase() + username).digest('hex').toUpperCase()
        return this.getDataValue('password') === shadow
      }
    },
    scopes: {
      all: {
        attributes: [
          'id',
          'global_id',
          'username',
          'real_name',
          'nick_name',
          'rank',
          'gender',
          'age',
          'register_type',
          'avatar',
          'phone',
          'email',
          'identity_code'
        ]
      },
      condition: function (params) {
        var where = {}
        if (params) {
          if (params['username']) {
            where['username'] = {like: '%' + params['real_name'].value[0] + '%'}
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
