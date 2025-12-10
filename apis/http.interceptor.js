import md5 from 'js-md5'
import decryptData from '@/common/js/decryptData.js'

const install = () => {
  uni.$u.http.interceptor.request = config => {
    // 获取设备信息
    const systemInfo = uni.getSystemInfoSync()
    config.header['device-id'] = systemInfo.deviceId
    config.header['platform'] = systemInfo.platform

    config.header['version'] = systemInfo.appWgtVersion || '1.0.0'

    config.header['server'] = 'true'
    config.header['accept'] = 'application/json'
    config.header['content-type'] = 'application/json'
    let token = uni.vk.getStorageSync('uni_id_token')
    if (token) {
      config.header['ba-user-token'] = `${token}`
    }

    return config
  }
  uni.$u.http.interceptor.response = (res, header) => {
    return res
  }
}
export default install
