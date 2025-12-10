/**
 * 登录模块封装
 */
const LoginModule = {
  /**
   * 主登录方法 - 一键登录
   * @returns {Promise}
   */
  async login() {
    if (!vk.getVuex('$user.preLoginInfo')) {
      uni.vk.hideLoading()
      console.log('uni==> ', uni)
      vk.navigateTo('/pages/login/index')
      return
    }

    let buttons = {
      iconWidth: '60px',
      list: [
        {
          provider: 'phoneNumber',
          iconPath: '/static/dddr111.png'
        }
      ]
    }

    if (vk.myfn.isIOS()) {
      buttons.list.unshift({
        provider: 'apple',
        iconPath: '/static/dddr13.png'
      })
      if (vk.myfn.checkWechatInstalled()) {
        buttons.list.unshift({
          provider: 'weixin',
          iconPath: '/static/dddr15.png'
        })
      }
    }
    if (!vk.myfn.isIOS()) {
      if (vk.myfn.checkWechatInstalled()) {
        buttons.list.unshift({
          provider: 'weixin',
          iconPath: '/static/dddr15.png'
        })
      }
    }
    uni.login({
      provider: 'univerify',
      univerifyStyle: {
        fullScreen: true,
        backgroundImage: 'static/dddr119.png',
        icon: {
          path: 'static/dddr72.png', // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
          width: '60px', //图标宽度 默认值：60px
          height: '60px', //图标高度 默认值：60px//
          borderRadius: '12px'
        },
        closeIcon: {
          // path: 'static/dddr119.png', // 自定义显示在授权框中的logo，仅支持本地图片
          width: '40px', //图标宽度 默认值：30px (HBuilderX 4.0+ 仅iOS支持)
          height: '40px' //图标高度 默认值：60px (HBuilderX 4.0+ 仅iOS支持)
        },
        authButton: {
          normalColor: '#00A9AB', // 授权按钮正常状态背景颜色 默认值：#3479f5
          highlightColor: '#00A9AB', // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
          disabledColor: '#00A9AB', // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
          textColor: '#ffffff', // 授权按钮文字颜色 默认值：#ffffff
          title: '本机号码一键登录', // 授权按钮文案 默认值："本机号码一键登录"
          borderRadius: '12px' // 授权按钮圆角 默认值："24px" （按钮高度的一半）
        },
        otherLoginButton: {
          visible: false, // 是否显示其他登录按钮，默认值：true
          normalColor: '', // 其他登录按钮正常状态背景颜色 默认值：透明
          highlightColor: '', // 其他登录按钮按下状态背景颜色 默认值：透明
          textColor: '#fff', // 其他登录按钮文字颜色 默认值：#656565
          title: '其他登录方式', // 其他登录方式按钮文字 默认值："其他登录方式"
          borderColor: '', //边框颜色 默认值：透明（仅iOS支持）
          borderRadius: '12px' // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
        },
        privacyTerms: {
          defaultCheckBoxState: true, // 条款勾选框初始状态 默认值： true
          isCenterHint: false, //未勾选服务条款时点击登录按钮的提示是否居中显示 默认值: false (3.7.13+ 版本支持)
          uncheckedImage: '/static/dddr120.png', // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
          checkedImage: '/static/dddr121.png', // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
          checkBoxSize: 12, // 可选 条款勾选框大小
          textColor: '#BBBBBB', // 文字颜色 默认值：#BBBBBB
          termsColor: '#00A9AB', //  协议文字颜色 默认值： #5496E3
          prefix: '我已阅读并同意', // 条款前的文案 默认值："我已阅读并同意"
          suffix: '并使用本机号码登录', // 条款后的文案 默认值："并使用本机号码登录"
          privacyItems: [
            {
              url: 'https://www.diaodiandaren.com/api/cms.article/view?code=user_agreement&server=true', // 点击跳转的协议详情页面
              title: '《钓点达人用户协议》' // 《钓点达人用户协议》
            },
            {
              url: 'https://www.diaodiandaren.com/api/cms.article/view?code=privacy_policy&server=true', // 点击跳转的协议详情页面
              title: '《钓点达人隐私政策》' // 《钓点达人隐私政策》
            }
          ]
        },
        buttons: buttons
      },
      success: function (res) {
        api
          .mobileLogin({
            access_token: res.authResult.access_token,
            openid: res.authResult.openid
          })
          .then(result => {
            console.log('🚀 ~ onLoad ~ result:', result)
            console.log('🚀 ~ onLoad ~ result:', result)
            console.log('🚀 ~ onLoad ~ result:', result)
            if (!result.code) return vk.toast(result.msg, 'none')
            vk.setStorageSync('uni_id_token', result.data.userInfo.token)
            vk.setStorageSync('uni_id_token_expired', result.data.userInfo.expire_time)
            vk.setStorageSync('refresh_token', result.data.userInfo.refresh_token)

            vk.setVuex('$user.userInfo', result.data.userInfo)
            uni.closeAuthView()
            vk.reLaunch('/pages/index/index')
          })
          .catch(err => {
            uni.closeAuthView()
            console.log('err==> ', err)
          })
      },
      fail: function (err) {
        console.log('🚀 ~ returnnewPromise ~ err:', err)
        if (err.provider == 'apple') {
          return LoginModule.appleLogin()
        }
        if (err.provider == 'weixin') {
          return LoginModule.wxLogin()
        }
        if (err.provider == 'phoneNumber' || err.code == 30002) {
          return vk.navigateTo('/pages/login/index')
        }
        if (err.code == 30003) return
        return vk.navigateTo('/pages/login/index')
      },
      complete: function () {
        uni.vk.hideLoading()
      }
    })
  },

  /**
   * 微信登录
   * @returns {Promise}
   */
  wxLogin(that) {
    uni.login({
      provider: 'weixin',
      onlyAuthorize: true,
      success: function (event) {
        vk.showLoading('登录中...')

        console.log('event==> ', event)

        // 获取到微信登录code后调用后端接口
        api
          .wechatLogin({
            code: event.code
          })
          .then(result => {
            console.log('🚀 ~ 微信登录:', result)
            console.log('🚀 ~ 微信登录:', result)
            console.log('🚀 ~ 微信登录:', result)
            if (result.data.needBind) {
              vk.navigateTo({
                url: `/pages/my/bindPhone?tempToken=${result.data.tempToken}`
              })
              return
            }
            if (!result.code) return vk.toast(result.msg, 'none')

            vk.setStorageSync('uni_id_token', result.data.userInfo.token)
            vk.setStorageSync('uni_id_token_expired', result.data.userInfo.expire_time)
            vk.setStorageSync('refresh_token', result.data.userInfo.refresh_token)

            vk.setVuex('$user.userInfo', result.data.userInfo)
            uni.closeAuthView()
            vk.reLaunch('/pages/index/index')
          })
          .catch(err => {
            console.log('微信登录 err==> ', err)
          })
          .finally(() => {
            vk.hideLoading()
          })
      },
      fail: function (err) {
        vk.hideLoading()
        uni.closeAuthView()
        console.log('err==> ', err)
        vk.toast('微信登录失败')
      }
    })
  },

  /**
   * 苹果登录
   * @returns {Promise}
   */
  appleLogin() {
    uni.login({
      provider: 'apple',
      success: function (loginRes) {
        console.log('loginRes==> ', loginRes)
        vk.showLoading('登录中...')

        api
          .appleLogin({
            code: loginRes.appleInfo.authorizationCode,
            identityToken: loginRes.appleInfo.identityToken
          })
          .then(result => {
            console.log('🚀 ~ 苹果登录:', result)
            console.log('🚀 ~ 苹果登录:', result)
            console.log('🚀 ~ 苹果登录:', result)
            if (result.data.needBind) {
              vk.navigateTo({
                url: `/pages/my/bindPhone?tempToken=${result.data.tempToken}`
              })
              return
            }
            if (!result.code) return vk.toast(result.msg, 'none')

            vk.setStorageSync('uni_id_token', result.data.userInfo.token)
            vk.setStorageSync('uni_id_token_expired', result.data.userInfo.expire_time)
            vk.setStorageSync('refresh_token', result.data.userInfo.refresh_token)

            vk.setVuex('$user.userInfo', result.data.userInfo)
            uni.closeAuthView()
            vk.reLaunch('/pages/index/index')
          })
          .catch(err => {
            console.log('err==> ', err)
          })
          .finally(() => {
            vk.hideLoading()
          })
      },
      fail: function (err) {
        vk.hideLoading()
      },
      complete: function () {
        vk.hideLoading()
      }
    })
  }
}

// 导出登录模块
export default LoginModule
