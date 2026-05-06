<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="p-3 pb-0 bg-white">
        <u-search v-model="state.keyword" placeholder="搜索预约" :show-action="false" @search="onSearch"></u-search>
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
          <view class="text-xs text-gray-400">预约单：{{ item.orderNo }}</view>
          <u-tag :text="item.statusText" :type="item.statusType" size="mini"></u-tag>
        </view>
        <view class="flex gap-3 p-3">
          <view class="size-20 bg-slate-200 flex-shrink-0 overflow-hidden rounded-lg">
            <u-image src="https://picsum.photos/200/300" class="!size-20" width="100%" height="100%"></u-image>
          </view>
          <view class="flex flex-col justify-between flex-1">
            <view class="text-sm text-gray-900">{{ item.title }}</view>
            <view class="mt-1 text-xs text-gray-400">{{ item.date }} {{ item.time }}</view>
            <view class="mt-1 text-xs text-gray-400">{{ item.location }}</view>
          </view>
        </view>
        <view class="flex items-center justify-between gap-2 p-3 border-t border-gray-100">
          <view class=""></view>
          <view class="flex items-center gap-2">
            <u-button v-if="item.status === 'pending'" size="mini" plain type="primary">取消预约</u-button>
            <u-button v-if="item.status === 'pending'" type="primary" plain size="mini">去使用</u-button>
            <u-button v-if="item.status === 'completed'" type="primary" plain size="mini">再次预约</u-button>
            <u-button v-if="item.status === 'cancelled'" type="primary" plain size="mini">重新预约</u-button>
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
    navTitle: '我的预约',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    keyword: '',
    dataList: [],
    tabList: [{ name: '全部' }, { name: '待使用' }, { name: '已完成' }, { name: '已取消' }],
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

    const status = ['all', 'pending', 'completed', 'cancelled'][state.value.currentTab]

    const mockData = {
      all: [
        // {
        //   orderNo: '20240115001',
        //   title: '故宫博物院',
        //   date: '2024-02-10',
        //   time: '09:00-12:00',
        //   location: '北京市东城区景山前街4号',
        //   status: 'pending',
        //   statusText: '待使用',
        //   statusType: 'primary',
        // },
        // {
        //   orderNo: '20240114002',
        //   title: '国家博物馆',
        //   date: '2024-02-08',
        //   time: '14:00-17:00',
        //   location: '北京市东城区东长安街16号',
        //   status: 'completed',
        //   statusText: '已完成',
        //   statusType: 'success',
        // },
        // {
        //   orderNo: '20240113003',
        //   title: '颐和园',
        //   date: '2024-02-05',
        //   time: '08:30-11:30',
        //   location: '北京市海淀区新建宫门路19号',
        //   status: 'cancelled',
        //   statusText: '已取消',
        //   statusType: 'info',
        // },
      ],
      pending: [
        {
          orderNo: '20240115001',
          title: '故宫博物院',
          date: '2024-02-10',
          time: '09:00-12:00',
          location: '北京市东城区景山前街4号',
          status: 'pending',
          statusText: '待使用',
          statusType: 'primary',
        },
      ],
      completed: [
        {
          orderNo: '20240114002',
          title: '国家博物馆',
          date: '2024-02-08',
          time: '14:00-17:00',
          location: '北京市东城区东长安街16号',
          status: 'completed',
          statusText: '已完成',
          statusType: 'success',
        },
      ],
      cancelled: [
        {
          orderNo: '20240113003',
          title: '颐和园',
          date: '2024-02-05',
          time: '08:30-11:30',
          location: '北京市海淀区新建宫门路19号',
          status: 'cancelled',
          statusText: '已取消',
          statusType: 'info',
        },
      ],
    }

    paging.value?.complete(mockData[status] || [])
  }
</script>

<style lang="scss" scoped></style>
