let http = uni.$u

const BASE_URL = import.meta.env.VITE_API_BASE_URL

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
