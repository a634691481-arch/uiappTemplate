<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="flex flex-col overflow-hidden">
      <!-- 背景渐变装饰 -->
      <!-- <view
        class="h-80 absolute top-0 left-0 right-0"
        :style="{
          background: `linear-gradient(180deg, ${uni.$u.color.primary}15 0%, transparent 100%)`,
        }"
      ></view> -->

      <!-- 内容区 -->
      <view class="relative z-10 flex flex-col flex-1 px-6 pt-12">
        <!-- 品牌 Logo -->
        <view class="flex flex-col items-center gap-4 mt-8 mb-10">
          <view
            class="rounded-3xl size-20 flex items-center justify-center shadow-lg"
            :style="{ backgroundColor: uni.$u.color.primary }"
          >
            <yy-icon name="ri:landscape-line" size="40" color="#ffffff" />
          </view>
          <view class="flex flex-col items-center gap-1">
            <view class="text-2xl font-bold text-gray-900">欢迎使用</view>
            <view class="text-sm text-gray-500">登录后享受更多专属权益</view>
          </view>
        </view>

        <!-- 功能亮点 -->
        <view class="grid grid-cols-3 gap-3 mb-10">
          <view class="rounded-xl flex flex-col items-center gap-2 p-3 bg-white shadow-sm">
            <view
              class="size-10 flex items-center justify-center rounded-lg"
              :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
            >
              <yy-icon name="ri:coupon-3-line" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-xs text-gray-600">会员优惠</view>
          </view>
          <view class="rounded-xl flex flex-col items-center gap-2 p-3 bg-white shadow-sm">
            <view
              class="size-10 flex items-center justify-center rounded-lg"
              :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
            >
              <yy-icon name="ri:gift-line" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-xs text-gray-600">积分兑换</view>
          </view>
          <view class="rounded-xl flex flex-col items-center gap-2 p-3 bg-white shadow-sm">
            <view
              class="size-10 flex items-center justify-center rounded-lg"
              :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
            >
              <yy-icon name="ri:vip-crown-line" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-xs text-gray-600">专属客服</view>
          </view>
        </view>

        <!-- 其他登录方式 -->
        <!-- <view class="flex flex-col items-center gap-4 mt-auto mb-40">
          <view class="flex items-center gap-3 text-xs text-gray-400">
            <view class="w-12 h-px bg-gray-200"></view>
            <text>其他登录方式</text>
            <view class="w-12 h-px bg-gray-200"></view>
          </view>
          <view class="flex items-center gap-8">
            <view
              class="size-12 active:opacity-70 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm"
              @click="onWechatLogin"
            >
              <yy-icon name="ri:wechat-fill" size="26" color="#07C160" />
            </view>
            <view
              class="size-12 active:opacity-70 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm"
              @click="onAppleLogin"
            >
              <yy-icon name="ri:apple-fill" size="26" color="#000000" />
            </view>
            <view
              class="size-12 active:opacity-70 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm"
              @click="onVisitorLogin"
            >
              <yy-icon name="ri:user-smile-line" size="26" color="#6b7280" />
            </view>
          </view>
        </view> -->
      </view>
    </view>
  </yy-paging>

  <!-- 底部固定按钮 -->
  <view class="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
    <view class="flex flex-col gap-3 p-3">
      <u-button
        type="primary"
        shape="circle"
        :custom-style="{ height: '44px', width: '60%' }"
        ripple
        @getphonenumber="onPhoneLogin"
        open-type="getPhoneNumber"
      >
        <view class="flex items-center justify-center gap-2">
          <!-- <yy-icon name="ri:smartphone-line" size="18" color="#ffffff" /> -->
          <text class="text-sm font-medium">手机号登录</text>
        </view>
      </u-button>

      <!-- 用户协议 -->
      <view class="flex items-center justify-center">
        <u-checkbox v-model="state.agree" shape="circle" size="28" :active-color="uni.$u.color.primary"></u-checkbox>
        <view class="text-xs text-gray-500">
          我已阅读并同意
          <text :style="{ color: uni.$u.color.primary }" @click="viewAgreement('user')">《用户协议》</text>
          和
          <text :style="{ color: uni.$u.color.primary }" @click="viewAgreement('privacy')">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '登录',

    color: uni.$u.color.primary,
    loadingMoreNoMoreText: '',
  })

  const state = ref({
    isScroll: false,
    dataList: [],
    agree: false,
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

  // 协议校验
  function checkAgree() {
    if (!state.value.agree) {
      uni.showToast({ title: '请先阅读并同意用户协议及隐私政策', icon: 'none' })
      return false
    }
    return true
  }

  // 手机号登录
  function onPhoneLogin() {
    if (!checkAgree()) return
    uni.showToast({ title: '手机号登录', icon: 'none' })
    // TODO: 跳转手机号登录页或弹出输入框
  }

  // 微信登录
  function onWechatLogin() {
    if (!checkAgree()) return
    uni.showToast({ title: '微信登录', icon: 'none' })
  }

  // Apple 登录
  function onAppleLogin() {
    if (!checkAgree()) return
    uni.showToast({ title: 'Apple 登录', icon: 'none' })
  }

  // 游客登录
  function onVisitorLogin() {
    uni.showToast({ title: '游客登录', icon: 'none' })
  }

  // 查看协议
  function viewAgreement(type) {
    const url = type === 'user' ? '/pages/my/privacy-policy' : '/pages/my/privacy-policy'
    uni.navigateTo({ url })
  }
</script>

<style lang="scss" scoped></style>
