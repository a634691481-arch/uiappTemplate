<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="flex flex-col gap-3 p-3">
      <!-- 顶部提示 -->
      <view class="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
        <yy-icon name="ri:information-line" size="20" color="#9ca3af" />
        <text class="text-xs text-gray-400">请如实填写投诉信息，我们会尽快为您处理</text>
      </view>

      <!-- 表单卡片 -->
      <view class="flex flex-col gap-3 p-3 overflow-hidden bg-white rounded-lg shadow-sm">
        <!-- 所在地区 -->
        <view class="flex items-center justify-between gap-3">
          <view class="text-sm text-gray-700">所在地区</view>
          <u-input
            v-model="form.region"
            placeholder="请选择所在地区"
            type="select"
            input-align="right"
            @click="showRegionPicker = true"
          />
        </view>

        <!-- 投诉对象 -->
        <view class="flex items-center justify-between gap-3">
          <view class="text-sm text-gray-700">投诉对象</view>
          <u-input v-model="form.target" placeholder="请输入投诉对象" input-align="right" />
        </view>

        <!-- 投诉分类 -->
        <view class="flex items-center justify-between gap-3">
          <view class="text-sm text-gray-700">投诉分类</view>
          <u-input
            v-model="form.category"
            placeholder="请选择投诉分类"
            type="select"
            input-align="right"
            @click="showCategoryPicker = true"
          />
        </view>

        <!-- 投诉类别 -->
        <view class="flex items-center justify-between gap-3">
          <view class="text-sm text-gray-700">投诉类别</view>
          <u-input
            v-model="form.subCategory"
            placeholder="请选择投诉类别"
            type="select"
            input-align="right"
            @click="showSubCategoryPicker = true"
          />
        </view>

        <!-- 投诉描述 -->
        <view class="flex flex-col gap-2">
          <view class="text-sm text-gray-700">投诉描述</view>
          <textarea
            v-model="form.description"
            class="bg-gray-50 rounded-xl w-full p-3 text-sm"
            style="height: 120px"
            placeholder="请详细描述您的投诉内容，便于我们快速处理"
            maxlength="500"
          />
          <view class="text-xs text-right text-gray-400">{{ form.description.length }}/500</view>
        </view>

        <!-- 姓名 -->
        <view class="flex items-center justify-between gap-3">
          <view class="text-sm text-gray-700">姓名</view>
          <u-input v-model="form.name" placeholder="请输入您的姓名" input-align="right" />
        </view>

        <!-- 电话 -->
        <view class="flex items-center justify-between gap-3">
          <view class="text-sm text-gray-700">电话</view>
          <u-input v-model="form.phone" placeholder="请输入您的电话" type="number" maxlength="11" input-align="right" />
        </view>
      </view>
    </view>
  </yy-paging>

  <!-- 底部固定提交按钮 -->
  <view class="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100">
    <u-button type="primary" shape="circle" @click="submit">提交投诉</u-button>
  </view>

  <!-- 选择器弹窗 -->
  <yy-picker-modal
    v-model="showRegionPicker"
    title="选择所在地区"
    :list="regionList"
    :value="form.region"
    @change="val => (form.region = val)"
  />

  <yy-picker-modal
    v-model="showCategoryPicker"
    title="选择投诉分类"
    :list="categoryList"
    :value="form.category"
    @change="val => (form.category = val)"
  />

  <yy-picker-modal
    v-model="showSubCategoryPicker"
    title="选择投诉类别"
    :list="subCategoryList"
    :value="form.subCategory"
    @change="val => (form.subCategory = val)"
  />
</template>

<script setup>
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '在线投诉',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    dataList: [],
  })

  const paging = ref()

  // 表单数据
  const form = ref({
    region: '',
    target: '',
    category: '',
    subCategory: '',
    description: '',
    name: '',
    phone: '',
  })

  // 弹窗显示状态
  const showRegionPicker = ref(false)
  const showCategoryPicker = ref(false)
  const showSubCategoryPicker = ref(false)

  // 选项数据
  const regionList = [
    '和平区',
    '河东区',
    '河西区',
    '南开区',
    '河北区',
    '红桥区',
    '东丽区',
    '西青区',
    '津南区',
    '北辰区',
    '武清区',
    '宝坻区',
    '滨海新区',
    '宁河区',
    '静海区',
    '蓟州区',
  ]
  const categoryList = ['服务质量', '价格问题', '安全问题', '环境卫生', '设施问题', '其他问题']
  const subCategoryList = [
    '服务态度差',
    '收费不透明',
    '虚假宣传',
    '安全隐患',
    '设备损坏',
    '卫生不达标',
    '行程变更',
    '强制消费',
    '其他',
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

  function submit() {
    if (!form.value.region) {
      vk.toast('请选择所在地区')
      return
    }
    if (!form.value.target.trim()) {
      vk.toast('请输入投诉对象')
      return
    }
    if (!form.value.category) {
      vk.toast('请选择投诉分类')
      return
    }
    if (!form.value.subCategory) {
      vk.toast('请选择投诉类别')
      return
    }
    if (!form.value.description.trim()) {
      vk.toast('请输入投诉描述')
      return
    }
    if (!form.value.name.trim()) {
      vk.toast('请输入您的姓名')
      return
    }
    if (!/^1\d{10}$/.test(form.value.phone)) {
      vk.toast('请输入正确的手机号')
      return
    }

    vk.toast('提交成功', 'success')
    // TODO: 调用接口提交表单
  }

  async function queryList(page, limit) {
    paging.value?.complete([1])
  }
</script>

<style lang="scss" scoped></style>
