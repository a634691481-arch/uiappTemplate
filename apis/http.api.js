const ENV_MAP = {
  prod: 'https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_prod',
  pre: 'https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_pre',
  test: 'https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_test',
}

const currentEnvironment = 'prod' // 'pre' | 'prod' | 'test' 默认预览环境

const BASE_URL = ENV_MAP[currentEnvironment] || ENV_MAP.pre

const install = app => {
  uni.$u.http.setConfig({ baseUrl: BASE_URL })
  globalThis.api = api
}

// API 封装
const api = {
  // 获取openid
  getOpenid: params => http.post(`/userEntity/wxLogin`, params, {}),

  //获取手机号码
  getPhoneNumber: params => http.post(`/loginWx`, params, {}),

  //获取用户信息
  getInfo: params => http.get(`/getSysUserInfo`, params, {}),
}

export { api }
export default { install, api }
