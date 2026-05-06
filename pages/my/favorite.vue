<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view class="p-3 pb-0 bg-white">
        <u-search v-model="state.keyword" placeholder="搜索收藏" :show-action="false" @search="onSearch"></u-search>
      </view>
      <u-tabs :list="state.tabList" :is-scroll="true" :current="state.currentTab" @change="onTabChange"></u-tabs>
    </template>
    <view class="flex flex-col gap-3 p-3">
      <view
        class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm"
        v-for="(item, index) in state.dataList"
        :key="index"
      >
        <view class="flex gap-3 p-3">
          <view class="size-24 bg-slate-200 flex-shrink-0 overflow-hidden rounded-lg">
            <u-image src="https://picsum.photos/200/300" class="!size-24" width="100%" height="100%"></u-image>
          </view>
          <view class="flex flex-col justify-between flex-1">
            <view>
              <view class="text-sm font-medium text-gray-900">{{ item.title }}</view>
              <view class="line-clamp-2 mt-1 text-xs text-gray-400">{{ item.desc }}</view>
            </view>
            <view class="flex items-center justify-between mt-2">
              <view class="text-sm font-bold text-gray-900">{{ item.price ? '¥' + item.price : item.tag }}</view>
              <view class="flex items-center gap-1">
                <u-icon name="star-fill" size="24" color="#f59e0b"></u-icon>
                <view class="text-xs text-gray-400">{{ item.score }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="flex items-center justify-between p-3 border-t border-gray-100">
          <view class="text-xs text-gray-400">{{ item.category }}</view>
          <view class="flex items-center gap-2">
            <u-button size="mini" type="primary" plain>取消收藏</u-button>
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
    navTitle: '我的收藏',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    keyword: '',
    dataList: [],
    tabList: [
      { name: '全部' },
      { name: '景区景点' },
      { name: '景点住宿' },
      { name: '精品线路' },
      { name: '攻略资讯' },
      { name: '美食' },
      { name: '特产' },
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

    const type = ['all', 'scenic', 'hotel', 'route', 'guide', 'food', 'specialty'][state.value.currentTab]

    const mockData = {
      all: [
        {
          title: '故宫博物院',
          desc: '中国明清两代的皇家宫殿，世界文化遗产',
          price: 60,
          score: 4.9,
          category: '景区景点',
        },
        { title: '颐和安缦酒店', desc: '皇家园林旁的顶级度假酒店', price: 2880, score: 4.8, category: '景点住宿' },
        { title: '北京三日深度游', desc: '故宫、长城、颐和园经典路线', price: 1280, score: 4.7, category: '精品线路' },
        { title: '北京美食攻略', desc: '老北京炸酱面、烤鸭、豆汁儿', tag: '攻略', score: 4.6, category: '攻略资讯' },
        { title: '全聚德烤鸭', desc: '中华老字号，正宗北京烤鸭', price: 298, score: 4.5, category: '美食' },
        { title: '稻香村糕点', desc: '百年老店，传统京味糕点', price: 88, score: 4.8, category: '特产' },
      ],
      scenic: [
        {
          title: '故宫博物院',
          desc: '中国明清两代的皇家宫殿，世界文化遗产',
          price: 60,
          score: 4.9,
          category: '景区景点',
        },
        { title: '天坛公园', desc: '明清两代皇帝祭天祈谷的场所', price: 15, score: 4.7, category: '景区景点' },
      ],
      hotel: [{ title: '颐和安缦酒店', desc: '皇家园林旁的顶级度假酒店', price: 2880, score: 4.8, category: '景点住宿' }],
      route: [
        { title: '北京三日深度游', desc: '故宫、长城、颐和园经典路线', price: 1280, score: 4.7, category: '精品线路' },
      ],
      guide: [
        { title: '北京美食攻略', desc: '老北京炸酱面、烤鸭、豆汁儿', tag: '攻略', score: 4.6, category: '攻略资讯' },
      ],
      food: [{ title: '全聚德烤鸭', desc: '中华老字号，正宗北京烤鸭', price: 298, score: 4.5, category: '美食' }],
      specialty: [{ title: '稻香村糕点', desc: '百年老店，传统京味糕点', price: 88, score: 4.8, category: '特产' }],
    }

    paging.value?.complete(mockData[type] || [])
  }
</script>

<style lang="scss" scoped></style>
