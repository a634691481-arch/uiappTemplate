<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="flex flex-col gap-3 p-3">
      <!-- 年卡权益 -->
      <view class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm">
        <view class="text-sm font-medium text-gray-900">年卡权益</view>
        <view class="flex flex-col gap-2">
          <view class="flex items-center gap-2" v-for="(item, index) in state.benefitList" :key="index">
            <yy-icon name="ri:checkbox-circle-line" size="18" :color="uni.$u.color.primary"></yy-icon>
            <view class="text-sm text-gray-700">{{ item }}</view>
          </view>
        </view>
      </view>

      <!-- 使用说明 -->
      <view class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm">
        <view class="text-sm font-medium text-gray-900">使用说明</view>
        <view class="text-xs leading-relaxed text-gray-500">
          <view>1. 年卡自激活之日起 365 天内有效</view>
          <view>2. 年卡仅限本人使用，不可转借他人</view>
          <view>3. 部分特殊活动及节假日可能不适用</view>
          <view>4. 年卡权益以平台最新公告为准</view>
        </view>
      </view>
    </view>

    <!-- 底部固定按钮 -->
    <view class="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100">
      <u-button type="primary" @click="activateCard">{{ state.isActivated ? '续费年卡' : '激活年卡' }}</u-button>
    </view>
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
    navTitle: '我的年卡',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    dataList: [],
    isActivated: false,
    expireDate: '2025-01-15',
    benefitList: [
      '全年无限次入园',
      '景点门票 8 折优惠',
      '专属 VIP 通道',
      '生日当月双倍积分',
      '会员专属活动优先报名',
      '免费停车 2 小时/次',
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

  function activateCard() {
    if (state.value.isActivated) {
      uni.showToast({ title: '续费功能开发中', icon: 'none' })
    } else {
      uni.showToast({ title: '激活功能开发中', icon: 'none' })
    }
  }

  async function queryList(page, limit) {
    paging.value?.complete([1])
  }
</script>

<style lang="scss" scoped></style>
