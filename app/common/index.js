// 请求成功后的响应
const success = (data) =>{
    var result = {type: 'success'}
    if (data || data === 0) {
      result.data = data
    }
    return result
  }
exports.success = success