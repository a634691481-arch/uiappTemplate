<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="flex items-center justify-between p-3 mx-3 mt-3 bg-white rounded-lg shadow-sm">
        <view class="flex items-center gap-2">
          <yy-icon name="ri:information-line" size="20" color="#9ca3af" />
          <text class="text-xs text-gray-400">订单服务由本平台提供</text>
        </view>
        <view>
          <u-button type="primary" plain size="mini" @click="showExplain = true">开票说明</u-button>
        </view>
      </view>
    </template>
    <view class="flex flex-col gap-3 p-3">
      <!-- 功能列表 -->
      <view class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
        <view
          class="last:border-b-0 active:bg-gray-50 flex items-center justify-between px-3 py-3 transition-all border-b border-gray-100"
          v-for="(item, index) in state.menuList"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <view class="flex items-center gap-3">
            <view
              class="flex items-center justify-center rounded-lg"
              style="width: 40px; height: 40px; background-color: rgba(var(--u-type-primary-rgb), 0.1)"
            >
              <yy-icon :name="item.icon" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-sm font-medium text-gray-800">{{ item.name }}</view>
          </view>
          <yy-icon name="ri:arrow-right-s-line" size="20" color="#d1d5db" />
        </view>
      </view>
    </view>

    <yy-tip-modal v-model="showExplain" title="开票说明" :list="explainList" />
  </yy-paging>
</template>

<script setup>
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '发票中心',
    color: uni.$u.color.primary,
  })

  const showExplain = ref(false)

  const explainList = [
    '发票类型支持电子普通发票和增值税专用发票',
    '订单完成后可申请开票，开票金额以实际支付金额为准',
    '电子发票将在申请后 1-3 个工作日内发送至您的邮箱',
    '发票内容默认为旅游服务费，如有特殊需求请联系客服',
    '发票抬头信息可在「发票抬头」页面提前维护',
  ]

  const state = ref({
    isScroll: false,
    dataList: [],
    menuList: [
      { name: '景点发票', icon: 'ri:landscape-line', url: '' },
      { name: '团购发票', icon: 'ri:group-line', url: '' },
      { name: '路线发票', icon: 'ri:map-pin-line', url: '' },
      { name: '特产发票', icon: 'ri:shopping-bag-line', url: '' },
      { name: '组合发票', icon: 'ri:stack-line', url: '' },

      { name: '发票历史', icon: 'ri:file-list-3-line', url: '' },
      { name: '发票抬头', icon: 'ri:bank-card-line', url: '' },
      { name: '咨询客服', icon: 'ri:customer-service-2-line', url: '' },
    ],
  })

  const paging = ref()

  onLoad(options => {
    console.log('🚀 页面加载:', options)
  })

  onShow(options => {
    console.log('🚀 页面显示:', options)
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  function navigateTo(url) {
    if (!url) {
      uni.showToast({ title: '功能开发中', icon: 'none' })
      return
    }
    vk.navigateTo(url)
  }

  async function queryList(page, limit) {
    paging.value?.complete([])
  }
</script>

<style lang="scss" scoped></style>
