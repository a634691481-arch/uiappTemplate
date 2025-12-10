'use strict'
let vk
const dbName = {
  //test: "vk-test",
}
const crypto = require('crypto')
let db = uniCloud.database()
let _ = db.command
let $ = _.aggregate

let cloudObject = {
  isCloudObject: true,

  _before: async function () {
    vk = this.vk
    // let { customUtil, uniID, config, pubFun } = this.getUtil(); // 获取工具包
  },

  _after: async function (options) {
    let { err, res } = options
    if (err) {
      return
    }
    return res
  },
  oneClickLogin: async function (data) {
    let res = {
      code: 0,
      msg: ''
    }
    // const secret = '9LLslNIAxV9gYYyLx1qwUE4GmFNlaEcz' // 自己的密钥不要直接使用示例值，且注意不要泄露
    // const hmac = crypto.createHmac('sha256', secret)

    // let params = data
    // const sign = params.sign
    // delete params.sign
    // const signStr = Object.keys(params)
    //   .sort()
    //   .map(key => {
    //     return `${key}=${params[key]}`
    //   })
    //   .join('&')

    // hmac.update(signStr)

    // if (sign !== hmac.digest('hex')) {
    //   throw new Error('非法访问')
    // }
    res.data = await uniCloud.getPhoneNumber({
      // appid: '__UNI__A72B031',
      appid: '__UNI__CA8E78B',
      provider: 'univerify',
      access_token: data.access_token,
      openid: data.openid
    })
    // res.data = data

    return res
  }
}

module.exports = cloudObject
