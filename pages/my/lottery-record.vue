<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="flex flex-col gap-2 p-3 pb-0 bg-white">
        <u-search v-model="state.keyword" placeholder="搜索抽奖记录" :show-action="false" @search="onSearch"></u-search>
        <!-- <u-subsection
          :list="state.categoryList"
          :current="state.currentCategory"
          @change="onCategoryChange"
          mode="button"
          active-color="var(--u-type-primary)"
        ></u-subsection> -->

        <u-tabs
          :list="state.categoryList"
          :is-scroll="false"
          :current="state.currentCategory"
          @change="onCategoryChange"
        ></u-tabs>
      </view>
    </template>
    <view class="flex flex-col gap-3 p-3">
      <view
        class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm"
        v-for="(item, index) in state.dataList"
        :key="index"
      >
        <view class="flex items-center justify-between p-3 border-b border-gray-100">
          <view class="text-sm font-medium text-gray-900">{{ item.title }}</view>
          <u-tag :text="item.statusText" :type="item.statusType" size="mini"></u-tag>
        </view>
        <view class="flex gap-3 p-3">
          <view class="size-20 bg-slate-200 flex-shrink-0 overflow-hidden rounded-lg">
            <u-image src="https://picsum.photos/200/300" class="!size-20" width="100%" height="100%"></u-image>
          </view>
          <view class="flex flex-col justify-between flex-1">
            <view class="text-sm text-gray-700">奖品：{{ item.prize }}</view>
            <view class="text-xs text-gray-400">{{ item.time }}</view>
            <view class="text-xs text-gray-400">类型：{{ item.category }}</view>
          </view>
        </view>
        <view class="flex items-center justify-between p-3 border-t border-gray-100">
          <view></view>
          <view class="flex items-center gap-2">
            <u-button v-if="item.status === 'win'" type="primary" plain size="mini">立即领取</u-button>
            <u-button v-if="item.status === 'received'" type="primary" plain size="mini">查看奖品</u-button>
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
    navTitle: '我的抽奖记录',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    keyword: '',
    dataList: [],
    categoryList: [{ name: '游戏' }, { name: '活动' }],
    currentCategory: 0,
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

  function onCategoryChange(index) {
    state.value.currentCategory = index
    paging.value?.reload()
  }

  function onSearch() {
    paging.value?.reload()
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))

    const category = ['game', 'activity'][state.value.currentCategory]

    const mockData = {
      game: [
        {
          title: '幸运大转盘',
          prize: 'iPhone 15 Pro',
          time: '2024-01-15 14:30',
          category: '游戏',
          status: 'win',
          statusText: '已中奖',
          statusType: 'error',
        },
        {
          title: '每日签到抽奖',
          prize: '10积分',
          time: '2024-01-14 09:00',
          category: '游戏',
          status: 'received',
          statusText: '已领取',
          statusType: 'success',
        },
        {
          title: '砸金蛋',
          prize: '谢谢参与',
          time: '2024-01-13 20:15',
          category: '游戏',
          status: 'lose',
          statusText: '未中奖',
          statusType: 'info',
        },
      ],
      activity: [
        {
          title: '春节集福活动',
          prize: '故宫门票一张',
          time: '2024-01-10 10:00',
          category: '活动',
          status: 'win',
          statusText: '已中奖',
          statusType: 'error',
        },
        {
          title: '周年庆抽奖',
          prize: '50元优惠券',
          time: '2024-01-08 16:00',
          category: '活动',
          status: 'received',
          statusText: '已领取',
          statusType: 'success',
        },
        {
          title: '国庆狂欢',
          prize: '谢谢参与',
          time: '2024-01-05 11:30',
          category: '活动',
          status: 'lose',
          statusText: '未中奖',
          statusType: 'info',
        },
      ],
    }

    paging.value?.complete(mockData[category] || [])
  }
</script>

<style lang="scss" scoped></style>
