<template>
  <u-tabbar
    v-model="current"
    :list="list"
    :borderTop="false"
    active-color="#18C9D9"
    inactive-color="#666666"
  ></u-tabbar>
</template>

<script>
  export default {
    data() {
      return {
        list: [
          {
            iconPath: '/static/tabbar/20251223095345.png',
            selectedIconPath: '/static/tabbar/20251223095343.png',
            text: '咨询',
            pagePath: '/pages/index/index'
          },
          {
            iconPath: '/static/tabbar/20251223095341.png',
            selectedIconPath: '/static/tabbar/20251223095342.png',
            text: '小红花',
            pagePath: '/pages/safflower/index'
          },
          {
            iconPath: '/static/tabbar/20251223095340.png',
            selectedIconPath: '/static/tabbar/20251223095337.png',
            text: '我的',
            pagePath: '/pages/my/index'
          }
        ],
        current: 0
      }
    }
  }
</script>
