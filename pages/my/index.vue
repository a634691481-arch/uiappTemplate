<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="flex flex-col gap-3 p-3">
      <!-- 用户信息 -->
      <view class="flex items-center justify-between gap-3 p-3 rounded-lg">
        <view class="flex items-center gap-2" @click="openEdit">
          <view
            class="size-14 bg-gray-50 flex items-center justify-center overflow-hidden border-2 rounded-full"
            :style="{ borderColor: `${uni.$u.color.primary}30` }"
          >
            <u-image :src="userInfo.avatar" width="100%" height="100%" class="!size-full" mode="aspectFill"></u-image>
          </view>

          <view class="flex flex-col">
            <view class="text-base font-medium text-gray-900">{{ userInfo.nickname }}</view>
            <view class="text-xs text-gray-400 mt-0.5">账号: 18599996666</view>
          </view>
        </view>
        <view
          class="size-8 flex items-center justify-center rounded-lg"
          style="background-color: rgba(var(--u-type-primary-rgb), 0.05)"
          @click.stop="navigateTo('/pages/my/profile')"
        >
          <zero-icon name="ri:arrow-right-s-line" size="20" :color="uni.$u.color.primary"></zero-icon>
        </view>
      </view>

      <!-- 快捷核销 -->
      <!-- <view class="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg shadow-sm">
        <view class="col-span-1">
          <u-button type="primary" plain size="small" class="!flex-1 *:!w-full">核销</u-button>
        </view>
        <view class="col-span-1">
          <u-button type="primary" plain size="small" class="!flex-1 *:!w-full">票根码核销</u-button>
        </view>
      </view> -->

      <!-- 金刚区 -->
      <view class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
        <view class="flex items-center justify-between p-3 border-b border-gray-100">
          <view class="text-sm font-medium text-gray-900">管理中心</view>
          <!-- <view class="flex items-center text-xs text-gray-400">
            全部
            <u-icon name="arrow-right" size="22" class="ml-0.5 align-middle"></u-icon>
          </view> -->
        </view>
        <view class="grid grid-cols-4 py-3">
          <view
            class="flex flex-col items-center justify-center gap-1.5"
            v-for="item in state.kingKongList"
            :key="item.name"
            @click="navigateTo(item.url)"
          >
            <view
              class="flex items-center justify-center rounded-lg"
              style="width: 36px; height: 36px; background-color: rgba(var(--u-type-primary-rgb), 0.1)"
            >
              <zero-icon :name="item.icon" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-xs text-gray-600">{{ item.name }}</view>
          </view>
        </view>
      </view>

      <!-- 我的订单 -->
      <view class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
        <view class="flex items-center justify-between p-3 border-b border-gray-100">
          <view class="text-sm font-medium text-gray-900">我的订单</view>
          <view class="inline-flex items-center text-xs text-gray-400" @click="navigateTo('/pages/my/order')">
            全部
            <u-icon name="arrow-right" size="22" class="ml-0.5 !align-top"></u-icon>
          </view>
        </view>
        <view class="grid grid-cols-4 py-3">
          <view
            class="flex flex-col items-center justify-center gap-1.5"
            v-for="item in state.order"
            :key="item.name"
            @click="navigateTo(item.url)"
          >
            <view
              class="flex items-center justify-center rounded-lg"
              style="width: 36px; height: 36px; background-color: rgba(var(--u-type-primary-rgb), 0.1)"
            >
              <zero-icon :name="item.icon" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-xs text-gray-600">{{ item.name }}</view>
          </view>
        </view>
      </view>

      <!-- 功能列表 -->
      <view class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
        <view
          class="last:border-b-0 active:bg-gray-50 flex items-center justify-between px-3 py-3 transition-colors border-b border-gray-100"
          v-for="(i, k) in state.list"
          :key="k"
          @click="navigateTo(i.url)"
        >
          <view class="flex items-center gap-3">
            <view
              class="flex items-center justify-center rounded-lg"
              style="width: 36px; height: 36px; background-color: rgba(var(--u-type-primary-rgb), 0.1)"
            >
              <zero-icon :name="i.icon" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-sm text-gray-700">{{ i.name }}</view>
          </view>
          <u-icon name="arrow-right" size="22" color="#ccc"></u-icon>
        </view>
      </view>
      <!-- <view class="w-full">
        <u-button type="primary" plain>退出登录</u-button>
      </view> -->

      <!--  -->
    </view>
  </yy-paging>
  <yy-edit-information v-model="showEdit" :user-info="userInfo" @success="onEditSuccess" />
</template>

<script setup>
  import { ref, computed } from 'vue'

  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    showTabbar: true,
    hideNav: false,
    showNavBack: true,
    navTitle: '我的',
    color: uni.$u.color.primary,
    loadingMoreNoMoreText: '',
  })

  const showEdit = ref(false)
  const userInfo = ref({
    nickname: '昵称',
    avatar: 'https://picsum.photos/200/300',
    gender: '男',
  })

  const state = ref({
    isScroll: false,
    dataList: [],
    avatarUrl: '',
    kingKongList: [
      { name: '优惠券', icon: 'ri:coupon-3-line', url: '/pages/my/coupon' },
      { name: '我的年卡', icon: 'ri:vip-crown-line', url: '/pages/my/year-card' },
      { name: '我的预约', icon: 'ri:calendar-check-line', url: '/pages/my/appointment' },
      { name: '我的演艺', icon: 'ri:clapperboard-line', url: '/pages/my/perform' },
    ],

    order: [
      { name: '待支付', icon: 'ri:bank-card-line', url: '/pages/my/order' },
      { name: '待使用', icon: 'ri:checkbox-circle-line', url: '/pages/my/order' },
      { name: '退款', icon: 'ri:refund-line', url: '/pages/my/order' },
      { name: '售后/退换', icon: 'ri:customer-service-2-line', url: '/pages/my/order' },
    ],
    list: [
      { name: '我的积分', icon: 'ri:coin-line', url: '/pages/my/integral' },
      { name: '一键定制', icon: 'ri:brush-line', url: '/pages/my/customization' },
      { name: '青年权益卡', icon: 'ri:id-card-line', url: '/pages/my/youth-card' },
      { name: '发票中心', icon: 'ri:bill-line', url: '/pages/my/invoice' },
      { name: '我的投诉', icon: 'ri:feedback-line', url: '/pages/my/complaint' },
      { name: '中奖记录', icon: 'ri:gift-line', url: '/pages/my/lottery-record' },
      { name: '我的收藏', icon: 'ri:star-line', url: '/pages/my/favorite' },
      { name: '我的消息', icon: 'ri:mail-line', url: '/pages/my/message' },
      { name: '出行人信息', icon: 'ri:team-line', url: '/pages/my/traveler' },
      { name: '隐私政策简要版', icon: 'ri:shield-user-line', url: '/pages/my/privacy-policy' },
      { name: '个人信息收集清单', icon: 'ri:file-list-3-line', url: '/pages/my/personal-info' },
      { name: '应用权限说明', icon: 'ri:settings-3-line', url: '/pages/my/app-permission' },
      { name: '我要分销', icon: 'ri:share-line', url: '/pages/my/distribution' },
    ],
  })

  const paging = ref()

  onLoad(options => {
    console.log('🚀 页面加载:', options)
  })

  onShow(options => {
    console.log('🚀 页面显示:', options)
  })

  function navigateTo(url) {
    console.log('🚀 ~ :150 ~ navigateTo ~ url:', url)
    vk.navigateTo(url)
  }

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))
    paging.value?.complete([1])
  }

  function openEdit() {
    showEdit.value = true
  }

  function onEditSuccess(data) {
    if (data?.nickname) userInfo.value.nickname = data.nickname
    if (data?.avatar) userInfo.value.avatar = data.avatar
    if (data?.gender !== undefined) userInfo.value.gender = data.gender === 1 ? '男' : '女'
  }
</script>

<style lang="scss" scoped>
  .ddd {
    color: rgba(var(--u-type-primary-rgb), 0.15) !important;
  }
</style>
