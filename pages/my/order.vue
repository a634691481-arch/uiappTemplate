<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="">
        <!-- 搜索框 -->
        <view class="p-3 pb-0 bg-white">
          <u-search v-model="state.keyword" placeholder="搜索订单" :show-action="false" @search="onSearch"></u-search>
        </view>
        <!-- Tab 切换 -->
        <u-tabs :list="state.tabList" :is-scroll="false" :current="state.currentTab" @change="onTabChange"></u-tabs>
      </view>
    </template>
    <view class="flex flex-col gap-3 p-3">
      <!-- 订单列表 -->
      <view class="flex flex-col gap-3">
        <view
          class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm"
          v-for="(item, index) in state.dataList"
          :key="index"
        >
          <!-- 订单头部 -->
          <view class="flex items-center justify-between p-3 border-b border-gray-100">
            <view class="text-xs text-gray-400">订单号：{{ item.orderNo }}</view>
            <u-tag :text="item.statusText" :type="item.statusType" size="mini"></u-tag>
          </view>

          <!-- 商品信息 -->
          <view class="flex gap-3 p-3">
            <view class="size-20 bg-slate-200 flex-shrink-0 overflow-hidden rounded-lg">
              <u-image src="https://picsum.photos/200/300" class="!size-20" width="100%" height="100%"></u-image>
            </view>
            <view class="flex flex-col justify-between flex-1">
              <view class="text-sm text-gray-900">{{ item.title }}</view>
              <view class="mt-1 text-xs text-gray-400">{{ item.spec }}</view>
              <view class="flex items-center justify-between mt-2">
                <view class="text-sm font-medium text-gray-900">¥{{ item.price }}</view>
                <view class="text-xs text-gray-400">x{{ item.count }}</view>
              </view>
            </view>
          </view>

          <!-- 订单底部 -->
          <view class="flex items-center justify-between p-3 border-t border-gray-100">
            <view class="text-xs text-gray-400">
              共{{ item.count }}件 合计：
              <text class="text-sm font-medium text-gray-900">¥{{ item.total }}</text>
            </view>
            <view class="flex gap-2">
              <u-button v-if="item.status === 'unpaid'" type="primary" size="mini" plain>去支付</u-button>
              <u-button v-if="item.status === 'unused'" type="primary" size="mini" plain>去使用</u-button>
              <u-button size="mini" type="primary">查看详情</u-button>
            </view>
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
    navTitle: '我的订单',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    keyword: '',
    dataList: [],
    tabList: [{ name: '全部' }, { name: '待支付' }, { name: '待使用' }, { name: '已完成' }, { name: '已取消' }],
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

    const types = ['all', 'unpaid', 'unused', 'completed', 'cancelled']
    const type = types[state.value.currentTab]

    const mockData = {
      all: [
        {
          orderNo: '20240115001',
          title: '故宫门票',
          spec: '成人票',
          price: 60,
          count: 2,
          total: 120,
          status: 'unpaid',
          statusText: '待支付',
          statusType: 'warning',
        },
        {
          orderNo: '20240114002',
          title: '国家博物馆',
          spec: '学生票',
          price: 30,
          count: 1,
          total: 30,
          status: 'unused',
          statusText: '待使用',
          statusType: 'primary',
        },
        {
          orderNo: '20240113003',
          title: '颐和园',
          spec: '成人票',
          price: 30,
          count: 2,
          total: 60,
          status: 'completed',
          statusText: '已完成',
          statusType: 'success',
        },
        {
          orderNo: '20240112004',
          title: '天坛公园',
          spec: '成人票',
          price: 15,
          count: 1,
          total: 15,
          status: 'cancelled',
          statusText: '已取消',
          statusType: 'info',
        },
      ],
      unpaid: [
        {
          orderNo: '20240115001',
          title: '故宫门票',
          spec: '成人票',
          price: 60,
          count: 2,
          total: 120,
          status: 'unpaid',
          statusText: '待支付',
          statusType: 'warning',
        },
      ],
      unused: [
        {
          orderNo: '20240114002',
          title: '国家博物馆',
          spec: '学生票',
          price: 30,
          count: 1,
          total: 30,
          status: 'unused',
          statusText: '待使用',
          statusType: 'primary',
        },
      ],
      completed: [
        {
          orderNo: '20240113003',
          title: '颐和园',
          spec: '成人票',
          price: 30,
          count: 2,
          total: 60,
          status: 'completed',
          statusText: '已完成',
          statusType: 'success',
        },
      ],
      cancelled: [],
    }

    paging.value?.complete(mockData[type] || [])
  }
</script>

<style lang="scss" scoped></style>
