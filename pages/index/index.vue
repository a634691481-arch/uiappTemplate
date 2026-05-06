<template>
  <scroll-view
    class="page-container"
    scroll-y
    :show-scrollbar="false"
    @scroll="onPageScroll"
  >
    <view class="scroll-content">
      <view class="navbar-content" :class="{ 'navbar-white': isNavbarWhite }">
      <image v-if="!isNavbarWhite" class="logo" src="/static/logo.png" mode="aspectFit" />
      <text v-else class="navbar-title-text">首页</text>
      <view class="city-selector" @click="openCitySelect">
        <text class="city-name">{{ currentCity }}</text>
        <text class="city-arrow">▼</text>
      </view>
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索内容</text>
      </view>
    </view>
    <view class="navbar-bg">
      <swiper
        class="bg-swiper"
        autoplay
        circular
        indicator-dots
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#fff"
      >
        <swiper-item v-for="(img, index) in bannerList" :key="index">
          <image class="bg-image" :src="img" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </view>
    <view class="content-area">
      <view class="tabpane">
        <view v-for="item in tabList" :key="item.name" class="tab-item" @click="switchTab1(item.name)">
          <image class="tab-icon" :src="item.icon" mode="aspectFit" />
          <view class="tab-name">{{ item.name }}</view>
        </view>
      </view>
      <view class="tabActivity">
        <view class="activity-header">
          <text class="activity-title">精彩活动</text>
        </view>
        <swiper
          class="swiper"
          circular
          :autoplay="true"
          interval="5000"
          duration="500"
          :previous-margin="110"
          :next-margin="110"
          :current="activeIndex"
          @change="onChange"
        >
          <swiper-item v-for="(item, index) in activityList" :key="index">
            <view class="card" :class="index === activeIndex ? 'active' : ''">
              <image :src="item" class="img" mode="aspectFill" />
            </view>
          </swiper-item>
        </swiper>
      </view>

      <view class="tab-section">
        <view class="section-tabs">
          <view
            v-for="(tab, index) in ['福利专区', '网红打卡']"
            :key="index"
            class="section-tab"
            :class="{ active: currentTab === index }"
            @click="switchTab(index)"
          >
            {{ tab }}
            <view class="tab-indicator" v-if="currentTab === index"></view>
          </view>
        </view>
        <swiper
          v-show="currentTab == 0"
          class="swiper"
          circular
          :autoplay="true"
          interval="5000"
          duration="500"
          :previous-margin="110"
          :next-margin="110"
          :current="activeIndex1"
          @change="onChange1"
        >
          <swiper-item v-for="(item, index) in activityList1" :key="index">
            <view class="card" :class="index === activeIndex1 ? 'active' : ''">
              <image :src="item" class="img" mode="aspectFill" />
            </view>
          </swiper-item>
        </swiper>

        <swiper
          v-show="currentTab == 1"
          class="swiper"
          circular
          :autoplay="true"
          interval="5000"
          duration="500"
          :previous-margin="110"
          :next-margin="110"
          :current="activeIndex2"
          @change="onChange2"
        >
          <swiper-item v-for="(item, index) in activityList1" :key="index">
            <view class="card" :class="index === activeIndex2 ? 'active' : ''">
              <image :src="item" class="img" mode="aspectFill" />
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>
  </scroll-view>
  <yy-tabbar></yy-tabbar>
</template>

<script setup>
const pagingConfig = ref({
  auto: false,
  refresherEnabled: false,
  showRefresherWhenReload: false,
  showTabbar: true,
  hideNav: false,
  showNavBack: true,
  navTitle: '首页',
  // navBackground: '',
  color: uni.$u.color.primary,
  loadingMoreNoMoreText: '',
  emptyText: '',
})

const state = ref({
  isScroll: false,
})
const activeIndex = ref(0)
const activeIndex1 = ref(0)
const activeIndex2 = ref(0)

const currentCity = ref('天津')
const topHeight = ref(0)
const isNavbarWhite = ref(false)

const bannerList = [
  'https://travel.tasiai.cn/FilePath/file/background481939721317265408.png',
  'https://travel.tasiai.cn/FilePath/file/background1481974387504066560.png',
]

const tabList = [
  { name: '景区', icon: 'https://travel.tasiai.cn/FilePath/file/jq481943985808748544.png' },
  { name: '住宿', icon: 'https://travel.tasiai.cn/FilePath/file/jd481943945769922560.png' },
  { name: '美食', icon: 'https://travel.tasiai.cn/FilePath/file/ms481944049675415552.png' },
  { name: '特产', icon: 'https://travel.tasiai.cn/FilePath/file/tc481944121121189888.png' },
  { name: '演艺', icon: 'https://travel.tasiai.cn/FilePath/file/yy481944092138549248.png' },
  { name: '交通', icon: 'https://travel.tasiai.cn/FilePath/file/jt481944019363180544.png' },
  { name: '线路', icon: 'https://travel.tasiai.cn/FilePath/file/xl481972183342788608.png' },
  { name: '秒杀', icon: 'https://travel.tasiai.cn/FilePath/file/gw481943902077857792.png' },
  { name: '票务', icon: 'https://travel.tasiai.cn/FilePath/file/pw481971133000986624.png' },
  { name: '其他', icon: 'https://travel.tasiai.cn/FilePath/file/qt481971431618654208.png' },
]

const activityList1=[
  'https://travel.tasiai.cn/FilePath/file/last482300419486527488.png',
  'https://travel.tasiai.cn/FilePath/file/last482300419486527488.png',
  'https://travel.tasiai.cn/FilePath/file/last482300419486527488.png',
  'https://travel.tasiai.cn/FilePath/file/last482300419486527488.png',
]
const activityList = [
  'https://travel.tasiai.cn/FilePath/file/huodong481976863703707648.png',
  'https://travel.tasiai.cn/FilePath/file/huodong481976863703707648.png',
  'https://travel.tasiai.cn/FilePath/file/huodong481976863703707648.png',
  'https://travel.tasiai.cn/FilePath/file/huodong481976863703707648.png',
]

const welfareList = [
  'https://travel.tasiai.cn/FilePath/file/jq481943985808748544.png',
  'https://travel.tasiai.cn/FilePath/file/jd481943945769922560.png',
  'https://travel.tasiai.cn/FilePath/file/ms481944049675415552.png',
  'https://travel.tasiai.cn/FilePath/file/tc481944121121189888.png',
]

const checkinList = [
  'https://travel.tasiai.cn/FilePath/file/yy481944092138549248.png',
  'https://travel.tasiai.cn/FilePath/file/jt481944019363180544.png',
  'https://travel.tasiai.cn/FilePath/file/xl481972183342788608.png',
  'https://travel.tasiai.cn/FilePath/file/gw481943902077857792.png',
]

const currentTab = ref(0)
const welfareActiveIndex = ref(0)
const checkinActiveIndex = ref(0)

const switchTab = index => {
  currentTab.value = index
  nextTick(() => {
    if (index == 1) {
      activeIndex2.value = 1
    } else {
      activeIndex1.value = 1
    }
  })
}

function onChange(e) {
  activeIndex.value = e.detail.current
}
function onChange1(e) {
  activeIndex1.value = e.detail.current
}
function onChange2(e) {
  activeIndex2.value = e.detail.current
}
const currentActivityIndex = ref(0)

const paging = ref()

onLoad(options => {
  console.log('🚀 页面加载:', options)
  setTimeout(() => {
    activeIndex.value = 1
    activeIndex1.value = 1
    activeIndex2.value = 1
  }, 300)
})

onShow(options => {
  console.log('🚀 页面加载:', options)
})

onMounted(() => {
  uni.$on('cityChange', city => {
    currentCity.value = city
  })
})

onUnmounted(() => {
  uni.$off('cityChange')
})

function openCitySelect() {
  uni.navigateTo({
    url: '/pages_sub/index/city-select?city=' + currentCity.value,
  })
}

function switchTab1(name) {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const lastScrollTop = ref(0)
const isScrollingDown = ref(false)
const scrollDirection = ref('')

function onPageScroll(e) {
  const scrollTop = e.detail ? e.detail.scrollTop : e.scrollTop
  
  if (scrollTop > lastScrollTop.value) {
    isScrollingDown.value = true
    scrollDirection.value = 'down'
    onScrollDown(scrollTop)
  } else {
    isScrollingDown.value = false
    scrollDirection.value = 'up'
    onScrollUp(scrollTop)
  }
  
  lastScrollTop.value = scrollTop
  
  if (scrollTop > 200) {
    isNavbarWhite.value = true
  } else {
    isNavbarWhite.value = false
  }
}

function onScrollDown(scrollTop) {
  console.log('📉 页面下滑中，滚动距离:', scrollTop)
  
  if (scrollTop > 500 && scrollTop < 1000) {
    console.log('触发：下滑超过500rpx')
  }
  
  if (scrollTop > 1000) {
    console.log('触发：下滑超过1000rpx')
  }
}

function onScrollUp(scrollTop) {
  console.log('📈 页面上滑中，滚动距离:', scrollTop)
  
  if (scrollTop < 100) {
    console.log('回到顶部区域')
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  height: calc(100vh - 166rpx);
  background: #f2fafc;
}

.scroll-content {
  padding-bottom: 120rpx;
}

.navbar-content.navbar-white {
  background: #fff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.navbar-content.navbar-white .city-name,
.navbar-content.navbar-white .city-arrow,
.navbar-content.navbar-white .search-icon,
.navbar-content.navbar-white .search-placeholder {
  color: #333;
}

.main-scroll {
  width: 100%;
  height: 100vh;
}

.scroll-content {
  padding-bottom: 120rpx;
}

.navbar-bg {
  width: 100%;
  height: 751rpx;
  overflow: hidden;
}

.bg-swiper {
  width: 100%;
  height: 751rpx;
}

.bg-image {
  width: 100%;
  height: 100%;
}

.navbar-content {
  z-index: 999;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  width: 76%;
  height: 258rpx;
  padding: 0 5rpx;
  box-sizing: border-box;
  transition: background 0.3s ease;
  .search-bar {
    display: flex;
    padding: 14rpx 26rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 40rpx;
    width: 312rpx;
  }
  .logo {
    width: 124rpx;
    height: 124rpx;
  }
  .city-selector {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 20rpx;
    border-radius: 32rpx;
    flex-shrink: 0;
  }
}

.navbar-content.navbar-white {
  background: #fff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.navbar-content.navbar-white .city-name,
.navbar-content.navbar-white .city-arrow,
.navbar-content.navbar-white .search-icon,
.navbar-content.navbar-white .search-placeholder {
  color: #333;
}

.city-name {
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
}

.city-arrow {
  font-size: 20rpx;
  color: #fff;
}

.search-icon {
  font-size: 28rpx;
}

.search-placeholder {
  font-size: 28rpx;
  color: #999;
}

.navbar-title-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.navbar-title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.navbar-subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.content-wrap {
  padding-top: 700rpx;
}

.tab-icon {
  width: 120rpx;
  height: 120rpx;
}
.content-area {
  position: absolute;
  padding: 0 30rpx;
  left: 0rpx;
  width: 100%;
}
.tabpane {
  display: flex;
  flex-wrap: wrap;
  border-radius: 20rpx;
  justify-content: space-between;
  background: #fff;
  padding: 36rpx 17rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

  margin-top: -130rpx;
  .tab-name {
    text-align: center;
    font-size: 26rpx;
  }
  .tab-item {
    display: flex;
    flex-wrap: wrap;
    font-size: 20rpx;
    color: #333;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    width: 120rpx;
  }
  .tab-item:nth-child(-n + 5) {
    margin-bottom: 40rpx;
  }
  image {
    width: 100rpx;
  }
}
.tabActivity {
  border-radius: 20rpx;
  background: #fff;
  padding: 36rpx 17rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  margin-top: 30rpx;
  background: url('https://travel.tasiai.cn/FilePath/file/activeBack481980836816891904.png');
  background-size: 100% 100%;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  justify-content: center;
}

.activity-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  font-weight: bold;
}

.activity-more {
  font-size: 26rpx;
  color: #999;
}

.activity-swiper {
  width: 100%;
  height: 300rpx;
}

.activity-swiper ::v-deep .swiper-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.activity-card {
  width: 260rpx;
  height: 200rpx;
  border-radius: 16rpx;
  overflow: hidden;
  transform: scale(0.8);
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0.6;
}

.activity-swiper .swiper-slide-active .activity-card {
  transform: scale(1.15);
  opacity: 1;
}

.activity-image {
  width: 100%;
  height: 100%;
}
.tabActivity {
  .carousel {
    padding: 30rpx 0;
  }

  /* 轮播高度 */
  .swiper {
    width: 100%;
    height: 180rpx;
  }

  /* 卡片样式 */
  .card {
    width: 100%;
    height: 180rpx;
    border-radius: 20rpx;
    overflow: hidden;
    transition: all 0.3s ease;
    transform: scale(0.8); /* 左右卡片缩小 */
  }

  /* 中间激活卡片最大 */
  .card.active {
    transform: scale(1);
  }

  /* 图片铺满 */
  .img {
    width: 100%;
    height: 100%;
  }
}

.tab-section {
  margin-top: 30rpx;
 
  border-radius: 20rpx;
  padding: 24rpx;
   .carousel {
    padding: 30rpx 0;
  }

  /* 轮播高度 */
  .swiper {
    width: 100%;
    height: 300rpx;
  }

  /* 卡片样式 */
  .card {
    width: 100%;
    height: 300rpx;
    border-radius: 20rpx;
    overflow: hidden;
    transition: all 0.3s ease;
    transform: scale(0.8); /* 左右卡片缩小 */
  }

  /* 中间激活卡片最大 */
  .card.active {
    transform: scale(1);
  }

  /* 图片铺满 */
  .img {
    width: 100%;
    height: 100%;
  }
}

.section-tabs {
  display: flex;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
  text-align: left;
}

.section-tab {
  width: 200rpx;
  font-size: 32rpx;
  color: #3d403f;
  position: relative;
  padding: 12rpx 0;
  transition: color 0.3s ease;

  &.active {
    font-weight: bold;
  }
}

.tab-indicator {
  position: absolute;
  bottom: -20rpx;
  left: 50%;
  transform: translate(-128%);
  width: 48rpx;
  height: 6rpx;
  background: #6ae3c0;
  border-radius: 3rpx;
}

.section-swiper {
  height: 220rpx;
}

.section-content {
  width: 100%;
  height: 100%;
}

.module-swiper {
  width: 100%;
  height: 100%;
}

.module-swiper ::v-deep .swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.module-swiper ::v-deep .swiper-slide-prev,
.module-swiper ::v-deep .swiper-slide-next {
  transform: scale(0.85);
  opacity: 0.7;
}

.module-swiper ::v-deep .swiper-slide-active {
  transform: scale(1);
  opacity: 1;
}

.module-card {
  width: 320rpx;
  height: 180rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;

  &.active {
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  }
}

.module-img {
  width: 100%;
  height: 100%;
}

.card-badge {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  padding: 6rpx 16rpx;
  background: linear-gradient(135deg, #ff3a56, #ff6b8a);
  color: #fff;
  font-size: 22rpx;
  border-radius: 20rpx;

  &.hot {
    background: linear-gradient(135deg, #ffb800, #ff8c00);
  }
}
</style>
