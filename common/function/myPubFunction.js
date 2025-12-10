let myfn = {}
import LoginModule from '@/common/js/login.js'
import UploadModule from '@/common/js/upload.js'
import upgradeModule from '@/common/js/appUpgrade.js'
import secureModule from '@/common/js/secure.js'

// 单张图片预览
myfn.previewImage = url => {
  uni.previewImage({
    urls: [url],
    current: url
  })
}
// 多张图片预览
myfn.previewImages = urls => {
  uni.previewImage({
    urls,
    current: urls[0]
  })
}

export default myfn
