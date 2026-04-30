<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="">
      <view class="flex flex-col gap-1 p-3 bg-white">
        <view class="text-sm font-medium text-gray-900">分销申请</view>
        <view class="text-xs text-gray-500">请填写以下信息开通分销权限</view>
      </view>
    </view>
    <view class="flex flex-col gap-3 p-3">
      <view class="flex flex-col gap-3 p-3 overflow-hidden bg-white rounded-lg shadow-sm">
        <view class="flex items-center gap-3">
          <view class="flex-shrink-0 w-16 text-sm text-gray-700">手机号码</view>
          <u-input
            v-model="state.form.phone"
            class="flex-1"
            placeholder="请输入手机号码"
            type="number"
            maxlength="11"
            inputAlign="right"
          ></u-input>
        </view>
        <view class="flex items-center gap-3">
          <view class="flex-shrink-0 w-16 text-sm text-gray-700">验证码</view>
          <u-input
            v-model="state.form.code"
            class="flex-1"
            placeholder="请输入验证码"
            type="number"
            maxlength="6"
            inputAlign="right"
          ></u-input>
          <u-verification-code ref="uCodeRef" seconds="60" @change="codeChange"></u-verification-code>
          <u-button size="mini" type="primary" :disabled="codeText !== '获取验证码'" @click="getCode">
            {{ codeText }}
          </u-button>
        </view>
        <view class="flex items-center justify-between gap-4">
          <view class="text-sm text-gray-700">身份类型</view>
          <u-radio-group v-model="state.form.identityType">
            <u-radio name="personal" label="个人"></u-radio>
            <u-radio name="enterprise" label="企业"></u-radio>
          </u-radio-group>
        </view>
        <view class="flex items-center gap-3">
          <view class="flex-shrink-0 w-16 text-sm text-gray-700">昵称</view>
          <u-input v-model="state.form.nickname" class="flex-1" placeholder="请输入昵称" inputAlign="right"></u-input>
        </view>
        <view class="flex items-center justify-between gap-4">
          <view class="text-sm text-gray-700">性别</view>
          <u-radio-group v-model="state.form.gender">
            <u-radio name="male" label="男"></u-radio>
            <u-radio name="female" label="女"></u-radio>
          </u-radio-group>
        </view>
        <view class="flex items-center justify-between">
          <view class="text-sm text-gray-700">行业</view>

          <u-input
            v-model="state.form.industry"
            class="flex-1"
            placeholder="请选择行业"
            type="select"
            maxlength="6"
            inputAlign="right"
            @click="showIndustryPicker = true"
          ></u-input>
          <!-- <view class="flex items-center gap-1">
            <view class="text-sm text-gray-500">{{ state.form.industry || '请选择行业' }}</view>
            <u-icon name="arrow-right" size="22" color="#ccc"></u-icon>
          </view> -->
        </view>
      </view>

      <view class="flex items-center gap-2 p-3 bg-white rounded-lg">
        <u-checkbox v-model="state.form.agree" shape="circle"></u-checkbox>
        <view class="text-xs text-gray-500">
          我已阅读并同意
          <text class="text-xs" :style="{ color: pagingConfig.color }" @click="showPolicy = true">《分销开通政策》</text>
        </view>
      </view>
    </view>

    <!-- 底部固定提交按钮 -->
    <view class="fixed bottom-0 left-0 right-0 p-3 bg-white border-t">
      <u-button type="primary" @click="submit">确定提交</u-button>
    </view>

    <yy-picker-modal
      v-model="showIndustryPicker"
      title="选择行业"
      :list="state.industryList"
      :value="state.form.industry"
      @change="selectIndustry"
    />

    <yy-tip-modal v-model="showPolicy" title="分销开通政策" :list="policyList" />
  </yy-paging>
</template>

<script setup>
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '我的分销',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    dataList: [],
    form: {
      phone: '',
      code: '',
      identityType: 'personal',
      nickname: '',
      gender: 'male',
      industry: '',
      agree: false,
    },
    industryList: ['旅游业', '酒店住宿', '餐饮服务', '交通运输', '文化传媒', '教育培训', '电子商务', '其他'],
  })

  const paging = ref()
  const uCodeRef = ref()
  const codeText = ref('获取验证码')
  const showIndustryPicker = ref(false)
  const showPolicy = ref(false)

  const policyList = [
    '申请人须年满 18 周岁，具备完全民事行为能力',
    '提交真实有效的个人信息，虚假信息将导致申请被拒绝',
    '分销佣金比例为订单金额的 5%-15%，根据业绩阶梯调整',
    '佣金将在订单完成后 7 个工作日内结算至绑定账户',
    '严禁恶意刷单、虚假宣传等违规行为，违者将取消分销资格',
    '平台保留随时调整分销政策的权利，调整将提前通知',
  ]

  onLoad(options => {
    console.log('🚀 页面加载:', options)
  })

  onShow(options => {
    console.log('🚀 页面显示:', options)
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  function codeChange(text) {
    codeText.value = text
  }

  function getCode() {
    if (!state.value.form.phone || state.value.form.phone.length !== 11) {
      uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    uCodeRef.value?.start()
    uni.showToast({ title: '验证码已发送', icon: 'success' })
  }

  function selectIndustry(item) {
    state.value.form.industry = item
    showIndustryPicker.value = false
  }

  function submit() {
    if (!state.value.form.phone) {
      uni.showToast({ title: '请输入手机号码', icon: 'none' })
      return
    }
    if (!state.value.form.code) {
      uni.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    if (!state.value.form.nickname) {
      uni.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }
    if (!state.value.form.industry) {
      uni.showToast({ title: '请选择行业', icon: 'none' })
      return
    }
    if (!state.value.form.agree) {
      uni.showToast({ title: '请同意分销开通政策', icon: 'none' })
      return
    }
    uni.showToast({ title: '提交成功', icon: 'success' })
  }

  async function queryList(page, limit) {
    paging.value?.complete([])
  }
</script>

<style lang="scss" scoped></style>
