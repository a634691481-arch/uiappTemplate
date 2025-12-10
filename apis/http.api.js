let http = uni.$u

// const BASE_URL = 'https://testdiaodianv2.tikevideos.shop'
const BASE_URL = 'https://www.diaodiandaren.com'

const install = e => {
  http.http.setConfig({
    baseUrl: BASE_URL
  })
  let vkGlobalThis = vk.getGlobalObject()
  if (typeof vkGlobalThis == 'object') vkGlobalThis.api = createApi()
}
// pageNum, pageSize
const createApi = () => ({
  // 发送短信验证码
  sendSms: params => http.post(`/api/sms/send`, params, {})
})
export default install
