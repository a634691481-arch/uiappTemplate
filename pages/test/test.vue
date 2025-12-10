<template>
  <view>
    <gggg-paging
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
          isBack
          backIconColor="#fff"
        >
        </u-navbar>
      </template>
      <template #empty>
        <tasi-empty></tasi-empty>
      </template>
      <template #loadingMoreNoMore>
        <tasi-nomore></tasi-nomore>
      </template>
	  <template #bottom>
		  <tasi-tabbar></tasi-tabbar>
	  </template>
      <view class="flex flex-col px-3"> </view>
    </tasi-paging>
    <!--  -->
    <!--  -->
    <!--  -->
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
</script>

<style lang="scss" scoped></style>
