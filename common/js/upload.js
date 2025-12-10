const UploadModule = {
  uploadImage(options = {}) {
    return new Promise((resolve, reject) => {
      const { count = 1, topic = 'images', onSuccess, onFail } = options

      uni.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          console.log('选择图片成功:', res)

          // 获取当前日期
          let date = new Date()
          let year = date.getFullYear()
          let month = String(date.getMonth() + 1).padStart(2, '0')
          let day = String(date.getDate()).padStart(2, '0')

          // 创建上传任务数组
          const uploadTasks = res.tempFilePaths.map((filePath, index) => {
            const tempFile = res.tempFiles[index]
            let suffix = ''

            // 判断是APP还是H5环境,分别处理文件名
            if (uni.getSystemInfoSync().platform === 'android' || uni.getSystemInfoSync().platform === 'ios') {
              // APP环境下从文件路径中提取后缀
              let pathArr = tempFile.path.split('.')
              suffix = pathArr.length > 1 ? `.${pathArr.pop().toLowerCase()}` : '.jpg'
            } else {
              // H5环境下从文件名中提取后缀
              suffix = tempFile.name ? `.${tempFile.name.split('.').pop().toLowerCase()}` : '.jpg'
            }

            // 生成文件名
            let randomStr = UploadModule._randomString(8)
            let timestamp = new Date().getTime()
            let fileName = `storage/${topic}/${year}${month}${day}/${timestamp}_${randomStr}${suffix}`

            // 返回上传Promise
            return UploadModule.fileUpload('image', filePath, fileName)
          })

          // 并行处理所有上传任务
          Promise.all(uploadTasks)
            .then(urls => {
              if (onSuccess) onSuccess(urls)
              resolve(urls) // 返回所有URL的数组
            })
            .catch(err => {
              if (onFail) onFail(err)
              reject(err)
            })
        },
        fail: function (err) {
          console.log('选择图片失败:', err)
          if (onFail) onFail(err)
          reject(err)
        }
      })
    })
  },

  fileUpload(type, path, storeAs) {
    return new Promise((resolve, reject) => {
      uni.showLoading({
        title: '文件上传中'
      })

      api
        .init()
        .then(res => {
          var data = res.data.site.upload
          var osshost = 'https://basan.oss-cn-chengdu.aliyuncs.com/'

          uni.uploadFile({
            url: data.url,
            filePath: path,
            fileType: type,
            name: 'file',
            formData: {
              key: storeAs,
              policy: data.params.policy,
              OSSAccessKeyId: data.params.OSSAccessKeyId,
              success_action_status: '200',
              Signature: data.params.Signature
            },
            success: res => {
              console.log('上传成功:', res)
              if (res.statusCode == 200) {
                const url = osshost + storeAs
                console.log('文件URL:', url)
                uni.hideLoading()
                resolve(url)
              } else {
                uni.hideLoading()
                reject(new Error('上传失败'))
              }
            },
            fail: err => {
              console.log('上传失败:', err)
              uni.hideLoading()
              uni.showModal({
                content: err.errMsg,
                showCancel: false
              })
              reject(err)
            }
          })
        })
        .catch(err => {
          uni.hideLoading()
          reject(err)
        })
    })
  },

  uploadVideo(options = {}) {
    return new Promise((resolve, reject) => {
      const { count = 1, topic = 'videos', maxDuration = 60, onSuccess, onFail } = options

      uni.chooseVideo({
        count: count,
        sourceType: ['album', 'camera'],
        maxDuration: maxDuration,
        compressed: false,
        // camera: 'back',
        success: function (res) {
          console.log('选择视频成功:', res)

          // 检查文件大小（可选，根据需要调整限制）
          const maxSize = 50 * 1024 * 1024 // 50MB
          if (res.size > maxSize) {
            const error = new Error('视频文件过大，请选择小于50MB的视频')
            if (onFail) onFail(error)
            reject(error)
            return
          }

          // 获取当前日期
          let date = new Date()
          let year = date.getFullYear()
          let month = String(date.getMonth() + 1).padStart(2, '0')
          let day = String(date.getDate()).padStart(2, '0')

          // 生成文件名
          let suffix = ''
          if (res.name) {
            suffix = res.name.split('.').pop().toLowerCase()
            suffix = suffix ? `.${suffix}` : '.mp4'
          } else {
            suffix = '.mp4' // 默认为mp4格式
          }

          let randomStr = UploadModule._randomString(8)
          let timestamp = new Date().getTime()
          let fileName = `storage/${topic}/${year}${month}${day}/${timestamp}_${randomStr}${suffix}`

          // 开始上传
          UploadModule.fileUpload('video', res.tempFilePath, fileName)
            .then(url => {
              const result = {
                url: url,
                duration: res.duration,
                size: res.size,
                width: res.width,
                height: res.height
                // orientation: res.width > res.height ? 'landscape' : 'portrait'
              }
              console.log('result==> ', result)
              if (onSuccess) onSuccess(result)
              resolve(result)
            })
            .catch(err => {
              if (onFail) onFail(err)
              reject(err)
            })
        },
        fail: function (err) {
          console.log('选择视频失败:', err)
          if (onFail) onFail(err)
          reject(err)
        }
      })
    })
  },

  _randomString(len) {
    len = len || 32
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = chars.length
    var pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }
}

// 导出上传模块
export default UploadModule
