<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="flex flex-col gap-3 p-3">
      <view
        class="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm"
        v-for="(item, index) in state.dataList"
        :key="index"
      >
        <view class="flex items-center justify-between p-3 border-b border-gray-100">
          <view class="flex items-center gap-2">
            <view class="text-sm font-medium text-gray-900">{{ item.name }}</view>
            <u-tag v-if="item.isDefault" text="默认" type="primary" size="mini"></u-tag>
            <u-tag :text="item.type" type="info" size="mini"></u-tag>
          </view>
          <view class="flex items-center gap-3">
            <yy-icon name="ri:edit-line" size="20" :color="uni.$u.color.primary" @click="editTraveler(item)"></yy-icon>
            <yy-icon name="ri:delete-bin-line" size="20" color="#ef4444" @click="deleteTraveler(item)"></yy-icon>
          </view>
        </view>
        <view class="flex flex-col gap-1 p-3">
          <view class="text-xs text-gray-500">{{ item.idType }}：{{ item.idNo }}</view>
          <view class="text-xs text-gray-500">手机号：{{ item.phone }}</view>
        </view>
      </view>
    </view>
  </yy-paging>
  <!-- 底部固定按钮 -->

  <view class="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100">
    <u-button type="primary" @click="addTraveler">新增出行人信息</u-button>
  </view>

  <!-- 新增出行人弹框 -->
  <u-popup v-model="showAddModal" mode="bottom" border-radius="16" :closeable="true" z-index="99">
    <view class="flex flex-col w-full p-4 bg-white">
      <view class="mb-4 text-base font-medium text-center text-gray-900">新增出行人</view>

      <view class="flex flex-col gap-3">
        <view class="flex items-center justify-between gap-3">
          <text class="text-sm text-gray-700">姓名</text>
          <u-input v-model="formData.name" placeholder="请输入姓名" input-align="right" />
        </view>

        <view class="flex items-center justify-between gap-3">
          <text class="text-sm text-gray-700">类型</text>
          <u-input
            v-model="formData.type"
            placeholder="请选择类型"
            type="select"
            input-align="right"
            @click="showTypeSelect"
          />
        </view>

        <view class="flex items-center justify-between gap-3">
          <text class="text-sm text-gray-700">证件类型</text>
          <u-input
            v-model="formData.idType"
            placeholder="请选择证件类型"
            type="select"
            input-align="right"
            @click="showIdTypeSelect"
          />
        </view>

        <view class="flex items-center justify-between gap-3">
          <text class="text-sm text-gray-700">证件号码</text>
          <u-input v-model="formData.idNo" placeholder="请输入证件号码" input-align="right" />
        </view>

        <view class="flex items-center justify-between gap-3">
          <text class="text-sm text-gray-700">手机号</text>
          <u-input v-model="formData.phone" placeholder="请输入手机号" input-align="right" type="number" maxlength="11" />
        </view>

        <view class="flex items-center gap-2 py-1">
          <u-checkbox v-model="formData.isDefault" shape="circle" :active-color="uni.$u.color.primary">
            <text class="text-sm text-gray-700">设为默认出行人</text>
          </u-checkbox>
        </view>
      </view>

      <view class="grid grid-cols-2 gap-2 mt-4">
        <u-button type="default" class="flex-1" @click="showAddModal = false">取消</u-button>
        <u-button type="primary" class="flex-1" @click="submitAdd">确定</u-button>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
  const pagingConfig = ref({
    auto: true,
    refresherEnabled: true,
    showRefresherWhenReload: true,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '出行人信息',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    dataList: [],
  })

  const paging = ref()

  const showAddModal = ref(false)
  const typeList = ['成人', '儿童']
  const idTypeList = ['身份证', '护照', '户口本']

  const formData = ref({
    name: '',
    type: '',
    idType: '',
    idNo: '',
    phone: '',
    isDefault: false,
  })

  function resetForm() {
    formData.value = {
      name: '',
      type: '',
      idType: '',
      idNo: '',
      phone: '',
      isDefault: false,
    }
  }

  function showTypeSelect() {
    uni.showActionSheet({
      itemList: typeList,
      success: res => {
        formData.value.type = typeList[res.tapIndex]
      },
    })
  }

  function showIdTypeSelect() {
    uni.showActionSheet({
      itemList: idTypeList,
      success: res => {
        formData.value.idType = idTypeList[res.tapIndex]
      },
    })
  }

  function submitAdd() {
    if (!formData.value.name.trim()) {
      uni.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!formData.value.idNo.trim()) {
      uni.showToast({ title: '请输入证件号码', icon: 'none' })
      return
    }
    if (!/^1\d{10}$/.test(formData.value.phone)) {
      uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    const newItem = {
      name: formData.value.name.trim(),
      type: formData.value.type,
      idType: formData.value.idType,
      idNo: formData.value.idNo.trim(),
      phone: formData.value.phone.trim(),
      isDefault: formData.value.isDefault,
    }

    if (newItem.isDefault) {
      state.value.dataList.forEach(item => (item.isDefault = false))
    }

    state.value.dataList.unshift(newItem)
    showAddModal.value = false
    vk.toast('添加成功', 'none')
  }

  onLoad(options => {
    console.log('🚀 页面加载:', options)
  })

  onShow(options => {
    console.log('🚀 页面显示:', options)
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  function addTraveler() {
    resetForm()
    showAddModal.value = true
  }

  function editTraveler(item) {
    // 编辑数据

    showAddModal.value = true
    formData.value = { ...item }
  }

  function deleteTraveler(item) {
    vk.confirm('确定删除该出行人信息吗？', '提示', '确定', '取消', res => {
      if (res.confirm) {
        // 删除数据

        state.value.dataList = state.value.dataList.filter(i => i !== item)
        vk.toast('删除成功', 'none')
      }
    })
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))

    const mockData = [
      { name: '张三', type: '成人', idType: '身份证', idNo: '11010119900101****', phone: '138****8888', isDefault: true },
      {
        name: '李四',
        type: '成人',
        idType: '身份证',
        idNo: '11010119950202****',
        phone: '139****9999',
        isDefault: false,
      },
      {
        name: '张小明',
        type: '儿童',
        idType: '户口本',
        idNo: '11010120200101****',
        phone: '138****8888',
        isDefault: false,
      },
    ]

    paging.value?.complete([...mockData])
  }
</script>

<style lang="scss" scoped></style>
