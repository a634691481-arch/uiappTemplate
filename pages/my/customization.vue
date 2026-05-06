<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="p-3 pb-0 bg-white">
        <u-search v-model="state.keyword" placeholder="搜索定制" :show-action="false" @search="onSearch"></u-search>
      </view>
      <u-tabs :list="state.tabList" :is-scroll="true" :current="state.currentTab" @change="onTabChange"></u-tabs>
    </template>
    <view class="flex flex-col gap-3 p-3">
      <view
        class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm"
        v-for="(item, index) in state.dataList"
        :key="index"
      >
        <view class="flex items-center justify-between p-3 border-b border-gray-100">
          <view class="text-xs text-gray-400">定制单：{{ item.orderNo }}</view>
          <u-tag :text="item.statusText" :type="item.statusType" size="mini"></u-tag>
        </view>
        <view class="flex gap-3 p-3">
          <view class="size-20 bg-slate-200 flex-shrink-0 overflow-hidden rounded-lg">
            <u-image src="https://picsum.photos/200/300" class="!size-20" width="100%" height="100%"></u-image>
          </view>
          <view class="flex flex-col justify-between flex-1">
            <view class="text-sm text-gray-900">{{ item.title }}</view>
            <view class="mt-1 text-xs text-gray-400">{{ item.desc }}</view>
            <view class="mt-1 text-xs text-gray-400">{{ item.time }}</view>
          </view>
        </view>
        <view class="flex items-center justify-between p-3 border-t border-gray-100">
          <view></view>
          <view class="flex items-center gap-2">
            <u-button v-if="item.status === 'pending'" type="primary" plain size="mini">催促分配</u-button>
            <u-button v-if="item.status === 'serving'" type="primary" plain size="mini">联系客服</u-button>
            <u-button v-if="item.status === 'completed'" type="primary" plain size="mini">再次定制</u-button>
            <u-button v-if="item.status === 'cancelled'" type="primary" plain size="mini">重新定制</u-button>
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
    navTitle: '一键定制',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    keyword: '',
    dataList: [],
    tabList: [
      { name: '全部' },
      { name: '待分配专属客服' },
      { name: '服务中' },
      { name: '服务完成' },
      { name: '服务取消' },
    ],
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

    const status = ['all', 'pending', 'serving', 'completed', 'cancelled'][state.value.currentTab]

    const mockData = {
      all: [
        {
          orderNo: '20240115001',
          title: '北京三日深度游定制',
          desc: '包含故宫、长城、颐和园等景点',
          time: '2024-01-15 10:30',
          status: 'pending',
          statusText: '待分配专属客服',
          statusType: 'warning',
        },
        {
          orderNo: '20240114002',
          title: '云南亲子游定制',
          desc: '大理、丽江、香格里拉路线',
          time: '2024-01-14 16:00',
          status: 'serving',
          statusText: '服务中',
          statusType: 'primary',
        },
        {
          orderNo: '20240110003',
          title: '海南蜜月游定制',
          desc: '三亚、万宁、海口环岛游',
          time: '2024-01-10 09:00',
          status: 'completed',
          statusText: '服务完成',
          statusType: 'success',
        },
        {
          orderNo: '20240105004',
          title: '西藏朝圣之旅定制',
          desc: '拉萨、林芝、珠峰大本营',
          time: '2024-01-05 14:20',
          status: 'cancelled',
          statusText: '服务取消',
          statusType: 'info',
        },
      ],
      pending: [
        {
          orderNo: '20240115001',
          title: '北京三日深度游定制',
          desc: '包含故宫、长城、颐和园等景点',
          time: '2024-01-15 10:30',
          status: 'pending',
          statusText: '待分配专属客服',
          statusType: 'warning',
        },
      ],
      serving: [
        {
          orderNo: '20240114002',
          title: '云南亲子游定制',
          desc: '大理、丽江、香格里拉路线',
          time: '2024-01-14 16:00',
          status: 'serving',
          statusText: '服务中',
          statusType: 'primary',
        },
      ],
      completed: [
        {
          orderNo: '20240110003',
          title: '海南蜜月游定制',
          desc: '三亚、万宁、海口环岛游',
          time: '2024-01-10 09:00',
          status: 'completed',
          statusText: '服务完成',
          statusType: 'success',
        },
      ],
      cancelled: [
        {
          orderNo: '20240105004',
          title: '西藏朝圣之旅定制',
          desc: '拉萨、林芝、珠峰大本营',
          time: '2024-01-05 14:20',
          status: 'cancelled',
          statusText: '服务取消',
          statusType: 'info',
        },
      ],
    }

    paging.value?.complete(mockData[status] || [])
  }
</script>

<style lang="scss" scoped></style>
