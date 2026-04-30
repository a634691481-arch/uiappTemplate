<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="">
        <!-- 积分卡片 -->
        <view class="flex items-center justify-between w-full p-3 bg-white rounded-lg">
          <view class="flex flex-col">
            <view class="text-xs text-gray-400">当前积分</view>
            <view class="mt-1 text-2xl font-bold text-gray-900">{{ state.integral }}</view>
          </view>
          <view class="">
            <u-button type="primary" plain size="mini" @click="state.showRules = true">规则说明</u-button>
          </view>
        </view>

        <!-- Tab 切换 -->
        <u-tabs :list="state.tabList" :is-scroll="false" :current="state.currentTab" @change="onTabChange"></u-tabs>
      </view>
    </template>
    <view class="flex flex-col gap-3 p-3">
      <!-- 记录列表 -->
      <view class="flex flex-col overflow-hidden bg-white rounded-lg">
        <view
          class="last:border-b-0 flex items-center justify-between px-3 py-3 border-b border-gray-100"
          v-for="(item, index) in state.dataList"
          :key="index"
        >
          <view class="flex flex-col">
            <view class="text-sm text-gray-700">{{ item.title }}</view>
            <view class="text-xs text-gray-400 mt-0.5">{{ item.time }}</view>
          </view>
          <view class="text-sm font-medium" :class="item.amount > 0 ? 'text-gray-900' : 'text-gray-400'">
            {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
          </view>
        </view>
      </view>
    </view>

    <yy-tip-modal v-model="state.showRules" title="积分规则" :list="rulesList" />
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
    navTitle: '我的积分',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    integral: 1280,
    dataList: [],
    currentTab: 0,
    showRules: false,
    tabList: [{ name: '全部' }, { name: '收入' }, { name: '支出' }, { name: '失效' }, { name: '使用' }],
  })

  const rulesList = [
    '每日签到可获得积分奖励',
    '积分可用于抵扣订单金额',
    '积分有效期为一年，过期自动失效',
    '如有疑问请联系客服',
  ]

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

  function onTabChange(index) {
    state.value.currentTab = index
    paging.value?.reload()
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))

    const types = ['all', 'income', 'expense', 'expired', 'used']
    const type = types[state.value.currentTab]

    const mockData = {
      all: [
        { title: '签到奖励', time: '2024-01-15 10:30', amount: 10 },
        { title: '订单消费', time: '2024-01-14 15:20', amount: -50 },
        { title: '积分过期', time: '2024-01-13 00:00', amount: -100 },
        { title: '新人礼包', time: '2024-01-12 09:00', amount: 200 },
      ],
      income: [
        { title: '签到奖励', time: '2024-01-15 10:30', amount: 10 },
        { title: '新人礼包', time: '2024-01-12 09:00', amount: 200 },
      ],
      expense: [{ title: '订单消费', time: '2024-01-14 15:20', amount: -50 }],
      expired: [{ title: '积分过期', time: '2024-01-13 00:00', amount: -100 }],
      used: [{ title: '订单抵扣', time: '2024-01-10 14:30', amount: -30 }],
    }

    paging.value?.complete(mockData[type] || [])
  }
</script>

<style lang="scss" scoped></style>
