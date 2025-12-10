<template>
  <u-tabbar v-model="current" :list="list" :borderTop='false'  active-color="#18C9D9" inactive-color="#666666"></u-tabbar>
</template>

<script>
  export default {
    data() {
      return {
        list: [
          {
            iconPath: '/static/tabbar/20251209154656.png',
            selectedIconPath: '/static/tabbar/20251209154657.png',
            text: '数据33',
            pagePath: '/pages/index/index'
          },
          {
            iconPath: '/static/tabbar/20251209154658.png',
            selectedIconPath: '/static/tabbar/20251209154659.png',
            text: '33',
            pagePath: '/pages/promotion/index'
          },
          {
            iconPath: '/static/tabbar/20251209154700.png',
            selectedIconPath: '/static/tabbar/20251209154703.png',
            text: '我的33',
            pagePath: '/pages/my/index'
          }
        ],
        current: 0
      }
    }
  }
</script>
