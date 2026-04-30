<template>
  <view :class="{ dark: isDark }" class="h-full">
    <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
      <view class="flex flex-col gap-3 p-3">
        <!-- 信息列表 -->
        <view class="dark:bg-gray-900 flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
          <view
            class="last:border-b-0 active:bg-gray-50 dark:active:bg-gray-800 dark:border-gray-800 flex items-center justify-between px-3 py-3 transition-colors border-b border-gray-100"
            v-for="(item, index) in state.infoList"
            :key="index"
            @click="handleItemClick(item)"
          >
            <view class="flex items-center gap-3">
              <view
                class="flex items-center justify-center rounded-lg"
                style="width: 36px; height: 36px; background-color: rgba(var(--u-type-primary-rgb), 0.1)"
              >
                <zero-icon :name="item.icon" size="20" :color="uni.$u.color.primary" />
              </view>
              <view class="dark:text-gray-200 text-sm text-gray-700">{{ item.label }}</view>
            </view>
            <view class="flex items-center gap-1">
              <view class="dark:text-gray-500 text-sm text-gray-400">{{ item.value || '未设置' }}</view>
              <u-icon name="arrow-right" size="22" color="#ccc"></u-icon>
            </view>
          </view>
        </view>
      </view>
    </yy-paging>

    <!-- 主题选择弹窗 -->
    <yy-theme-picker v-model="showThemePicker" @change="onThemeChange" />

    <!-- 深色模式选择弹窗 -->
    <yy-dark-mode-picker v-model="showDarkModePicker" @change="onDarkModeChange" />

    <view
      class="dark:bg-gray-900 dark:border-gray-800 fixed bottom-0 left-0 right-0 grid grid-cols-2 gap-2 p-3 bg-white border-t"
    >
      <view class="">
        <u-button type="primary" @click="saveProfile">保存资料</u-button>
      </view>
      <view class="">
        <u-button type="error" plain @click="logout">退出登录</u-button>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { useTheme } from '@/uni_modules/uview-pro'

  const { getCurrentTheme, darkMode } = useTheme()

  const isDark = computed(() => {
    if (darkMode.value === 'dark') return true
    if (darkMode.value === 'light') return false
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '个人资料',
    color: uni.$u.color.primary,
    loadingMoreNoMoreText: '',
  })

  const state = ref({
    isScroll: false,
    dataList: [],
    userInfo: {
      avatar: '',
      nickname: '旅游达人',
      phone: '185****6666',
    },
    infoList: [
      { label: '手机号码', icon: 'ri:smartphone-line', value: '185****6666', field: 'phone' },
      { label: '昵称', icon: 'ri:user-smile-line', value: '旅游达人', field: 'nickname' },
      { label: '性别', icon: 'ri:men-line', value: '男', field: 'gender' },
      { label: '生日', icon: 'ri:cake-line', value: '1995-08-15', field: 'birthday' },
      { label: '所在地区', icon: 'ri:map-pin-line', value: '广西壮族自治区 南宁市', field: 'region' },
      { label: '个性签名', icon: 'ri:edit-line', value: '探索世界，发现美好', field: 'signature' },
      { label: '主题', icon: 'ri:palette-line', value: '默认主题', field: 'theme' },
      // { label: '深色模式', icon: 'ri:moon-line', value: '关闭', field: 'darkMode' },
      // { label: '清除缓存', icon: 'ri:delete-bin-line', value: '0.00MB', field: 'clearCache' },
    ],
  })

  const currentThemeName = ref('')
  const showThemePicker = ref(false)
  const showDarkModePicker = ref(false)

  const paging = ref()

  onLoad(options => {
    console.log('🚀 页面加载:', options)
  })

  onShow(options => {
    console.log('🚀 页面显示:', options)
    const theme = getCurrentTheme()
    if (theme) {
      currentThemeName.value = theme.name
      const themeItem = state.value.infoList.find(i => i.field === 'theme')
      if (themeItem) themeItem.value = theme.label
    }
    const { getDarkMode } = useTheme()
    const darkMode = getDarkMode()
    const darkModeItem = state.value.infoList.find(i => i.field === 'darkMode')
    if (darkModeItem) {
      const labelMap = { dark: '开启', auto: '自动', light: '关闭' }
      darkModeItem.value = labelMap[darkMode] || '关闭'
    }
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  function handleItemClick(item) {
    console.log('🚀 ~ :103 ~ handleItemClick ~ item:', item)
    if (item.field === 'theme') {
      showThemePicker.value = true
      return
    }
    if (item.field === 'darkMode') {
      showDarkModePicker.value = true
      return
    }
    uni.showToast({ title: `编辑${item.label}`, icon: 'none' })
  }

  function onThemeChange(item) {
    currentThemeName.value = item.name
    const themeItem = state.value.infoList.find(i => i.field === 'theme')
    if (themeItem) themeItem.value = item.label
    vk.toast(`已切换为${item.label}`, 'none')
  }

  function onDarkModeChange(item) {
    const darkModeItem = state.value.infoList.find(i => i.field === 'darkMode')
    if (darkModeItem) darkModeItem.value = item.label
    vk.toast(`已切换为${item.label}`, 'none')
  }

  function saveProfile() {
    vk.toast('保存成功', 'none')
  }

  function logout() {
    uni.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          uni.showToast({ title: '已退出登录', icon: 'none' })
        }
      },
    })
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))
    paging.value?.complete([1])
  }
</script>

<style lang="scss" scoped></style>
