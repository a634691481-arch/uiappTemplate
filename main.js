import App from './App'
import store from './store'
import config from '@/app.config.js'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

uni.$zp = {
  config: {
    'default-page-size': 12
  }
}

// 引入 vk框架前端
import vk from './uni_modules/vk-unicloud'

// 引入 uView UI
import uView from './uni_modules/vk-uview-ui'

// // 引入 http 拦截器
import httpInterceptor from '@/apis/http.interceptor.js'

// // 引入 API 集中管理
import httpApi from '@/apis/http.api.js'

// #ifndef VUE3
import Vue from 'vue'

const app = new Vue({
  store,
  ...App
})

// 引入 vk框架前端
Vue.use(vk, config)

// 引入 uView UI
Vue.use(uView)

// 引入 http 拦截器
Vue.use(httpInterceptor, app)

// 引入 API 集中管理
Vue.use(httpApi)

Vue.config.productionTip = false

App.mpType = 'app'

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  // 引入自动动画插件
  app.use(autoAnimatePlugin)

  // 引入 uView UI
  app.use(uView)

  // 引入 vk框架前端
  app.use(vk, config)

  // 引入vuex
  app.use(store)

  // 引入 API 集中管理
  app.use(httpApi)

  // // 引入 http 拦截器
  app.use(httpInterceptor)

  return { app }
}

// #endif
