<template>
  <view>
    <!-- <yy-paging
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
        <yy-empty></yy-empty>
      </template>
      <template #loadingMoreNoMore>
        <yy-nomore></yy-nomore>
      </template>
      <view class="flex flex-col px-3"> </view>
    </yy-paging> -->
    <web-view src="https://static-mp-7d13aaae-6ab7-4da9-b4f0-115c02a1486f.next.bspapp.com/#/" />
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
    title: '首4444444444444页',
    url: 'https://static-mp-7d13aaae-6ab7-4da9-b4f0-115c02a1486f.next.bspapp.com/#/'
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
