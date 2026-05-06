<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="grid grid-cols-4 py-3 bg-white rounded-lg shadow-sm">
        <view
          class="flex flex-col items-center justify-center gap-1.5"
          v-for="item in state.menuList"
          :key="item.name"
          @click="navigateTo(item.url)"
        >
          <view
            class="flex items-center justify-center rounded-lg"
            style="width: 36px; height: 36px; background-color: rgba(var(--u-type-primary-rgb), 0.1)"
          >
            <yy-icon :name="item.icon" size="20" :color="uni.$u.color.primary" />
          </view>
          <view class="text-xs text-gray-600">{{ item.name }}</view>
        </view>
      </view>
    </template>
    <view class="flex flex-col gap-3 p-3">
      <!-- 消息列表 -->
      <view class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
        <view class="p-3 border-b border-gray-100">
          <view class="text-sm font-medium text-gray-900">最近消息</view>
        </view>
        <view
          class="last:border-b-0 active:bg-gray-50 flex flex-col gap-1 px-3 py-3 transition-colors border-b border-gray-100"
          v-for="(item, index) in state.dataList"
          :key="index"
        >
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <view class="text-sm font-medium text-gray-900">{{ item.title }}</view>
              <u-badge v-if="!item.read" is-dot></u-badge>
            </view>
            <view class="text-xs text-gray-400">{{ item.time }}</view>
          </view>
          <view class="line-clamp-1 text-xs text-gray-500">{{ item.content }}</view>
        </view>
      </view>
    </view>
  </yy-paging>
</template>

<script setup>
  const pagingConfig = ref({
    auto: true,
    refresherEnabled: true,
    showRefresherWhenReload: true,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '我的消息',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    dataList: [],
    menuList: [
      { name: '系统消息', icon: 'ri:notification-3-line', url: '' },
      { name: '订单通知', icon: 'ri:file-list-3-line', url: '' },
      { name: '优惠促销', icon: 'ri:coupon-3-line', url: '' },
      { name: '账户通知', icon: 'ri:user-line', url: '' },
    ],
  })

  const paging = ref()

  onLoad(options => {
    console.log('🚀 页面加载:', options)
  })

  onShow(options => {
    console.log('🚀 页面显示:', options)
  })

  function navigateTo(url) {
    if (!url) {
      uni.showToast({ title: '功能开发中', icon: 'none' })
      return
    }
    vk.navigateTo(url)
  }

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))

    const mockData = [
      {
        title: '系统公告',
        content: '平台将于今晚 00:00-06:00 进行系统维护，期间部分功能可能无法使用',
        time: '10:30',
        read: false,
      },
      { title: '订单通知', content: '您预订的「故宫博物院」门票已出票成功，请准时前往', time: '昨天', read: false },
      { title: '优惠活动', content: '新春特惠：全场景点门票 8 折起，限时 3 天', time: '昨天', read: true },
      { title: '账户通知', content: '您的账户已成功绑定手机号 185****6666', time: '01-14', read: true },
      { title: '系统公告', content: '青年权益卡新增 3 项专属权益，快来查看吧', time: '01-13', read: true },
    ]

    paging.value?.complete(mockData)
  }
</script>

<style lang="scss" scoped></style>
