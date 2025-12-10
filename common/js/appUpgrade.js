const upgradeModule = {
  upgrade() {
    plus.runtime.getProperty(plus.runtime.appid, inf => {
      api
        .init()
        .then(res => {
          uni.vk.vuex.set('$app.initData', res.data)
          if (res.data.needUpdate) {
            vk.navigateTo(
              '/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update?obj=' +
                JSON.stringify(res.data.version)
            )
          } else {
          }
        })
        .catch(err => {
          inf.versionCode
        })
    })
  }
}

// 导出登录模块
export default upgradeModule
