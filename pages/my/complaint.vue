<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="p-3 pb-0 bg-white">
        <u-search v-model="state.keyword" placeholder="搜索投诉" :show-action="false" @search="onSearch"></u-search>
      </view>
      <u-tabs :list="state.tabList" :is-scroll="false" :current="state.currentTab" @change="onTabChange"></u-tabs>
    </template>
    <view class="flex flex-col gap-3 p-3">
      <view
        class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm"
        v-for="(item, index) in state.dataList"
        :key="index"
      >
        <view class="flex items-center justify-between p-3 border-b border-gray-100">
          <view class="text-xs text-gray-400">投诉单：{{ item.orderNo }}</view>
          <u-tag :text="item.statusText" :type="item.statusType" size="mini"></u-tag>
        </view>
        <view class="flex flex-col gap-1 p-3">
          <view class="text-sm font-medium text-gray-900">{{ item.type }}</view>
          <view class="text-sm text-gray-700">{{ item.content }}</view>
          <view class="text-xs text-gray-400">{{ item.time }}</view>
        </view>
        <view class="flex items-center justify-between p-3 border-t border-gray-100">
          <view></view>
          <view class="flex items-center gap-2">
            <u-button v-if="item.status === 'pending'" type="primary" size="mini" plain>撤销投诉</u-button>
            <u-button v-if="item.status === 'replied'" type="primary" plain size="mini">查看回复</u-button>
            <u-button v-if="item.status === 'resolved'" type="primary" plain size="mini">评价</u-button>
            <u-button size="mini" type="primary">查看详情</u-button>
          </view>
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
    navTitle: '我的投诉',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    keyword: '',
    dataList: [],
    tabList: [{ name: '全部' }, { name: '处理中' }, { name: '已回复' }, { name: '已解决' }, { name: '已关闭' }],
    currentTab: 0,
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

  function onTabChange(index) {
    state.value.currentTab = index
    paging.value?.reload()
  }

  function onSearch() {
    paging.value?.reload()
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))

    const status = ['all', 'pending', 'replied', 'resolved', 'closed'][state.value.currentTab]

    const mockData = {
      all: [
        {
          orderNo: '20240115001',
          type: '订单问题',
          content: '门票未出票，已支付但未收到确认短信',
          time: '2024-01-15 10:30',
          status: 'pending',
          statusText: '处理中',
          statusType: 'warning',
        },
        {
          orderNo: '20240114002',
          type: '服务态度',
          content: '景区工作人员态度恶劣，要求道歉',
          time: '2024-01-14 16:00',
          status: 'replied',
          statusText: '已回复',
          statusType: 'primary',
        },
        {
          orderNo: '20240110003',
          type: '退款纠纷',
          content: '申请退款后迟迟未到账，已超过7个工作日',
          time: '2024-01-10 09:00',
          status: 'resolved',
          statusText: '已解决',
          statusType: 'success',
        },
        {
          orderNo: '20240105004',
          type: '产品质量',
          content: '购买的特产存在质量问题，要求退货退款',
          time: '2024-01-05 14:20',
          status: 'closed',
          statusText: '已关闭',
          statusType: 'info',
        },
      ],
      pending: [
        {
          orderNo: '20240115001',
          type: '订单问题',
          content: '门票未出票，已支付但未收到确认短信',
          time: '2024-01-15 10:30',
          status: 'pending',
          statusText: '处理中',
          statusType: 'warning',
        },
      ],
      replied: [
        {
          orderNo: '20240114002',
          type: '服务态度',
          content: '景区工作人员态度恶劣，要求道歉',
          time: '2024-01-14 16:00',
          status: 'replied',
          statusText: '已回复',
          statusType: 'primary',
        },
      ],
      resolved: [
        {
          orderNo: '20240110003',
          type: '退款纠纷',
          content: '申请退款后迟迟未到账，已超过7个工作日',
          time: '2024-01-10 09:00',
          status: 'resolved',
          statusText: '已解决',
          statusType: 'success',
        },
      ],
      closed: [
        {
          orderNo: '20240105004',
          type: '产品质量',
          content: '购买的特产存在质量问题，要求退货退款',
          time: '2024-01-05 14:20',
          status: 'closed',
          statusText: '已关闭',
          statusType: 'info',
        },
      ],
    }

    paging.value?.complete(mockData[status] || [])
  }
</script>

<style lang="scss" scoped></style>
