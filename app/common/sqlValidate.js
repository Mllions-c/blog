/**
 * 验证规则
 */
module.exports = {
  isPhone: {
    // is: { args: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/i, msg: "电话格式不正确" }
    is: {args: /^.*$/i, msg: '电话格式不正确'}
  },
  isEmail: {
    isEmail: {args: true, msg: '邮箱地址不正确'}
  },
  valPassword: {
    is: {args: /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,20}/, msg: '密码格式不正确'}
  }
}
