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
      <template #bottom>
        <yy-tabbar></yy-tabbar>
      </template>
      <view class="flex flex-col p-3">
        <view>
          <view @click="getLocation" class="inline-flex px-3 py-1 bg-green-500 rounded-full">
            <text class="text-base text-white">获取定位</text>
          </view>
          <view @click="playAudio" class="inline-flex px-3 py-1 bg-green-500 rounded-full">
            <text class="text-base text-white">播放</text>
          </view>
          <view @click="pauseAudio" class="inline-flex px-3 py-1 bg-green-500 rounded-full">
            <text class="text-base text-white">暂停</text>
          </view>
        </view>
      </view>
    </yy-paging>
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
  // 获取定位
  function getLocation() {
    vk.showLoading({
      title: '定位中...'
    })
    uni.getLocation({
      type: 'gcj02',
      success: res => {
        console.log('🚀 ~ :73 ~ getLocation ~ res:', res)
        vk.alert(res)
      },
      fail: err => {
        console.log('🚀 ~ :80 ~ getLocation ~ err:', err)
        vk.alert(err)
      },
      complete: () => {
        vk.hideLoading()
      }
    })
  }
  //  播放音频
  function playAudio() {
    const innerAudioContext = uni.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'https://whc.aicisl.org.cn/chat/wuhouci/audio/通用导览1_导览图.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError(res => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
  function pauseAudio() {}
</script>

<style lang="scss" scoped></style>
