<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="flex flex-col gap-3 p-3">
      <view class="flex flex-col gap-3 p-3 bg-white rounded-lg">
        <view class="text-sm font-medium text-gray-900">应用权限说明</view>
        <view class="text-xs text-gray-500">
          为了向您提供更好的服务，我们的应用可能需要访问以下系统权限。您可以在系统设置中管理这些权限。
        </view>

        <view class="flex flex-col gap-2 mt-1">
          <view
            class="bg-slate-50 flex items-start gap-3 p-2 rounded-md"
            v-for="(item, index) in state.permissionList"
            :key="index"
          >
            <view
              class="flex items-center justify-center flex-shrink-0 rounded-lg"
              style="width: 36px; height: 36px; background-color: rgba(var(--u-type-primary-rgb), 0.1)"
            >
              <yy-icon :name="item.icon" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="flex flex-col gap-1">
              <view class="text-sm font-medium text-gray-800">{{ item.name }}</view>
              <view class="text-xs text-gray-500">{{ item.desc }}</view>
              <view class="text-xs text-gray-400">使用场景：{{ item.scene }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </yy-paging>
</template>

<script setup>
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: true,
    showRefresherWhenReload: true,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '应用权限说明',
    // navBackground: '',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    dataList: [],
    permissionList: [
      {
        name: '相机权限',
        icon: 'ri:camera-line',
        desc: '用于拍照上传头像、扫描二维码、拍摄景点照片等',
        scene: '头像上传/扫码/拍照',
      },
      {
        name: '位置权限',
        icon: 'ri:map-pin-line',
        desc: '用于获取您的位置信息，推荐附近景点和提供导航服务',
        scene: '附近推荐/地图导航',
      },
      {
        name: '存储权限',
        icon: 'ri:hard-drive-2-line',
        desc: '用于保存图片到本地、缓存数据以提升应用性能',
        scene: '图片保存/数据缓存',
      },
      {
        name: '相册权限',
        icon: 'ri:image-line',
        desc: '用于从相册选择图片上传头像或分享景点照片',
        scene: '头像上传/图片分享',
      },
      { name: '麦克风权限', icon: 'ri:mic-line', desc: '用于语音搜索、语音输入评价内容等', scene: '语音搜索/语音评价' },
      {
        name: '通知权限',
        icon: 'ri:notification-3-line',
        desc: '用于接收订单状态通知、优惠活动提醒等消息',
        scene: '订单通知/活动提醒',
      },
      { name: '电话权限', icon: 'ri:phone-line', desc: '用于拨打客服电话、联系商家等', scene: '联系客服/联系商家' },
    ],
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

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))
    paging.value?.complete([1])
  }
</script>

<style lang="scss" scoped></style>
