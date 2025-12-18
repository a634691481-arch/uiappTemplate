<template>
  <view>
    <yy-paging
      v-model="state.dataList"
      @query="queryList"
      ref="paging"
      :auto="false"
      @scroll="scroll"
      :refresher-enabled="true"
    >
      <template #top>
        <u-navbar
          :background="{ backgroundColor: state.isScroll ? '#18C9D9' : '#18C9D9' }"
          :title="state.title"
          :border-bottom="false"
          title-color="#fff"
          backIconColor="#fff"
        >
        </u-navbar>
      </template>
      <template #empty>
        <yy-empty></yy-empty>
      </template>
      <template #loadingMoreNoMore>
        <yy-nomore></yy-nomore>
      </template>
      <template #bottom>
        <yy-tabbar></yy-tabbar>
      </template>
      <view class="flex flex-col p-3">
        <!-- 按钮 -->
        <view class="px-6 mt-6 w-full">
          <view
            class="active:opacity-90 flex justify-center items-center py-3 w-full rounded-full transition-all"
            style="
              background: linear-gradient(135deg, #18c9d9 0%, #0eb0c0 100%);
              box-shadow: 0 8px 16px -4px rgba(24, 201, 217, 0.4);
            "
            @click="openWeapp"
          >
            <u-icon name="miniprogram-fill" color="#fff" size="36"></u-icon>
            <text class="ml-2 text-lg font-bold text-white">跳转到微信小程序</text>
            <u-icon name="arrow-right" color="#fff" size="24" class="ml-1 opacity-80"></u-icon>
          </view>
          <view class="mt-3 text-xs text-center text-gray-400"> 点击上方按钮唤起小程序 </view>
        </view>
      </view>
    </yy-paging>
  </view>
</template>

<script setup>
  // 状态
  const state = ref({
    isScroll: false,
    dataList: [],
    title: '首页'
  })

  // 组件引用
  const paging = ref()
  const alert = ref()

  // 页面生命周期（Uni-App）
  onLoad(options => {
    console.log('🚀 ~ :55 ~ options:', options)
    // openWeapp()
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  function queryList(page, limit) {
    console.log('🚀 ~ :58 ~ queryList ~ page, limit:', page, limit)
    setTimeout(() => {
      paging.value?.complete([1])
    }, 1000)
  }

  function openWeapp() {
    const scheme = 'weixin://dl/business/?appid=wx02245e9a1237f40c&path=pages/home/index'
    window.location.href = scheme
  }
</script>

<style lang="scss" scoped></style>
