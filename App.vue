<script>
  import config from '@/app.config.js'
  import { version } from './package.json'
  export default {
    methods: {},
    // 监听 - 页面404
    // 监听 - 页面404
    onPageNotFound: function (e) {
      uni.redirectTo({
        url: config.error.url
      })
    },
    onLaunch: function (options) {
      // console.log('onLaunch==> ', onLaunch)

      // 一键登录初始化
      // #ifdef APP-PLUS

      // #endif
      uni.getSystemInfo({
        success: function (e) {
          // mark StatusBar 手机状态栏
          // mark CustomBar 微信浏览器状态栏
          vk.setVuex('$app.windowHeight', e.windowHeight)

          // #ifndef MP
          vk.setVuex('$app.StatusBar', e.statusBarHeight)

          if (e.platform == 'android') {
            vk.setVuex('$app.CustomBar', e.statusBarHeight + 50)
          } else {
            vk.setVuex('$app.CustomBar', e.statusBarHeight + 45)
          }
          // #endif

          // #ifdef MP-WEIXIN

          vk.setVuex('$app.StatusBar', e.statusBarHeight)

          let custom = wx.getMenuButtonBoundingClientRect()
          vk.setVuex('$app.Custom', custom)

          vk.setVuex('$app.CustomBar', custom.bottom + custom.top - e.statusBarHeight)

          // #endif

          // #ifdef MP-ALIPAY
          vk.setVuex('$app.StatusBar', e.statusBarHeight)

          vk.setVuex('$app.CustomBar', e.statusBarHeight + e.titleBarHeight)

          // #endif
        }
      })
      // error ：config.debug 在正式环境时，值为false，故此{}内的代码只有开发环境才会执行
      if (config.debug) {
        // #ifndef APP-PLUS
        console.log(
          `%c vk-client %c v${version} `,
          'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
          'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
        )
        // #endif
        console.log('App Launch')
      }
      // error：以下代码正式和开发环境都会执行
      // #ifdef MP
      uni.vk.updateManager.updateReady() // 此代码可以让小程序自动检测最新版本
      // #endif
    },

    onShow: function () {
      // #ifdef APP-PLUS

      uni.vk.vuex.dispatch('$app/getInitData')
      //

      // #endif
    },
    onHide: function () {
      if (config.debug) console.log('App Hide')
    }
  }
</script>

<style lang="scss">
  @import './uni_modules/vk-uview-ui/index.scss';
  // @import './common/css/main.css';
  @import './common/css/icon.css';

  @import 'tailwindcss/base';
  @import 'tailwindcss/utilities';
  @import 'tailwindcss/components';

  .page {
    background-color: #f4f6f8 !important;
    font-family: sans-serif !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
  }

  .pb-env {
    padding-bottom: calc(env(safe-area-inset-bottom) / 2);
  }

  @font-face {
    font-family: 'oxanium';
    src: url('font/Oxanium-Bold.ttf');
  }
  .arc-bg {
    position: absolute;
    left: -25%;
    top: 0;
    width: 150%;
    height: 140px;
    background-color: #18c9d9;
    border-bottom-left-radius: 100%;
    border-bottom-right-radius: 100%;
    z-index: -1;
  }
</style>
