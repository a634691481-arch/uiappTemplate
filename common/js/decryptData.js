import CryptoJS from 'crypto-js'
/**
 * 解密函数
 * @param {string} encryptedData - 加密数据
 * @param {string} key - 密钥
 * @returns {string} 解密后的明文
 */
function decryptData(encryptedData, key) {
  try {
    // 解码并解析加密数据
    const data = JSON.parse(atob(encryptedData))
    const iv = data.iv
    const encrypted = data.value
    const mac = data.mac

    // 验证HMAC签名
    const hash = hashData(iv, encrypted, key)
    if (hash !== mac) {
      throw new Error('Hash mismatch')
    }

    // 执行解密
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const ivHex = CryptoJS.enc.Base64.parse(iv)
    const encryptedHex = CryptoJS.enc.Base64.parse(encrypted)

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedHex }, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    const res = decrypted.toString(CryptoJS.enc.Utf8)
    if (res) {
      return JSON.parse(res)
    }
  } catch (error) {
    console.error('解密失败:', error)
    throw error
  }
}

/**
 * 生成mac
 * @param {string} iv - 初始向量
 * @param {string} value - 加密值
 * @param {string} key - 密钥
 * @returns {string} 哈希值
 */
function hashData(iv, value, key) {
  // 使用HMAC-SHA256算法计算哈希
  const hash = CryptoJS.HmacSHA256(iv + value, key)
  return hash.toString(CryptoJS.enc.Hex)
}

export default decryptData
