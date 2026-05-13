<template>
  <scroll-view class="page-container" scroll-y :show-scrollbar="false" @scroll="onPageScroll">
    <view class="scroll-content">
      <view class="navbar-content" :class="{ 'navbar-white': isNavbarWhite }">
        <image v class="logo" src="/static/logo.png" mode="aspectFit" />
        <view class="city-selector" @click="openCitySelect">
          <text class="city-name" :style="{ color: isNavbarWhite ? '#333' : '#fff' }">{{ currentCity }}</text>
          <text class="city-arrow">▼</text>
        </view>
        <view class="search-bar" :style="{ background: isNavbarWhite ? '#E5E5E5' : '#fff' }">
          <u-input
            v-model="searchValue"
            class="search-placeholder"
            placeholder="搜索内容"
            :placeholder-color="isNavbarWhite ? '#fff' : '#333'"
          ></u-input>
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
          <view v-for="item in tabList" :key="item.name" class="tab-item" @click="goTab()">
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
        <view class="tabActivity1">
          <view class="section-tabs">
            <view
              v-for="(tab, index) in ['活动专区', '活动日历']"
              :key="index"
              class="section-tab"
              :class="{ active: currentTab1 === index }"
              @click="switchTab1(index)"
            >
              {{ tab }}
              <view class="tab-indicator" v-if="currentTab1 === index"></view>
            </view>
          </view>
          <swiper
            v-if="currentTab1 === 0"
            class="swiper"
            circular
            :autoplay="true"
            interval="5000"
            duration="500"
            :previous-margin="110"
            :next-margin="110"
            :current="activeIndex3"
            @change="onChange3"
          >
            <swiper-item v-for="(item, index) in activityList1" :key="index">
              <view class="card" :class="index === activeIndex3 ? 'active' : ''">
                <image :src="item" class="img" mode="aspectFill" />
              </view>
            </swiper-item>
          </swiper>

          <swiper
            v-if="currentTab1 === 1"
            class="swiper"
            circular
            :autoplay="true"
            interval="5000"
            duration="500"
            :previous-margin="110"
            :next-margin="110"
            :current="activeIndex4"
            @change="onChange4"
          >
            <swiper-item v-for="(item, index) in activityList1" :key="index">
              <view class="card" :class="index === activeIndex4 ? 'active' : ''">
                <image :src="item" class="img" mode="aspectFill" />
              </view>
            </swiper-item>
          </swiper>
        </view>
        <view>
          <view class="news-header">
            <view class="news-title">文旅咨询</view>
            <view class="news-search" @click="goToSearch">
              <text class="search-icon">🔍</text>
              <text class="search-placeholder">搜索更多资讯</text>
            </view>
          </view>
          <view class="news-carousel">
            <view class="tag">最新资讯</view>
            <swiper
              class="text-swiper"
              vertical
              autoplay
              :interval="3000"
              :duration="500"
              circular
              :indicator-dots="false"
            >
              <swiper-item v-for="(item, index) in newsList" :key="index">
                <view class="news-item">
                  <text class="news-text">{{ item.text }}</text>
                </view>
              </swiper-item>
            </swiper>
          </view>
          <view class="trip" @click="goTab()">
            <view>跟着赛事去旅行</view>
            <view>跟着演出去旅行</view>
            <view>舌尖上的广西</view>
            <view>文博之旅 艺览天津</view>
          </view>
        </view>

        <view class="interaction">
          <view class="fixItem">
            <view class="interaction-title">互动社区</view>
            <view>分享你眼中的天津</view>
          </view>
          <view class="borad" @click="goTab()">
            <image src="https://travel.tasiai.cn/FilePath/file/生成宣传图484823486859325440.png" mode="aspectFill" />
          </view>
        </view>

        <view class="interaction" style="margin-bottom: 50rpx">
          <view class="fixItem">
            <view class="interaction-title">目的地行程</view>
            <view>想玩的不一样,来这里</view>
          </view>
          <scroll-view class="itinerary-scroll" scroll-x :show-scrollbar="false">
            <view class="itinerary">
              <view class="tab" v-for="(item, index) in itineraryList" :key="index" @click="goTab()">
                <image :src="item.img" mode="aspectFill" />
                <view>{{ item.name }}</view>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="borad" @click="openThirdMiniProgram">
          <image src="https://travel.tasiai.cn/FilePath/file/生成宣传图484803962806218752.png" mode="aspectFill" />
        </view>

        <view class="science">
          <view class="science-back">
            <view class="iscience-title">景区实况</view>
            <view>景在手中,尽在掌中</view>
          </view>
          <view class="fixItem" @click="goTab()">
            <image
              src="https://travel.tasiai.cn/FilePath/file/35aaddd6f6cbb9db8f5c26935da8d509484831290714238976.png"
              mode="aspectFill"
            />
            <image
              src="https://travel.tasiai.cn/FilePath/file/35aaddd6f6cbb9db8f5c26935da8d509484831290714238976.png"
              mode="aspectFill"
            />
          </view>
        </view>

        <view class="promotion">
          <view class="promotion-back">
            <view class="promotion-title">天津</view>
            <view>多彩天津,文化之旅</view>
          </view>
          <view>
            <scroll-view class="promotion-scroll" scroll-x :show-scrollbar="false">
              <view class="promotion">
                <view class="tab" v-for="(item, index) in promotionList1" :key="index" @click="goTab()">
                  <image :src="item.img" mode="aspectFill" />
                  <view>{{ item.name }}</view>
                </view>
              </view>
            </scroll-view>
            <scroll-view class="promotion-scroll" scroll-x :show-scrollbar="false">
              <view class="promotion">
                <view class="tab" v-for="(item, index) in promotionList1" :key="index" @click="goTab()">
                  <image :src="item.img" mode="aspectFill" />
                  <view>{{ item.name }}</view>
                </view>
              </view>
            </scroll-view>
            <scroll-view class="promotion-scroll" scroll-x :show-scrollbar="false">
              <view class="promotion">
                <view class="tab" v-for="(item, index) in promotionList1" :key="index" @click="goTab()">
                  <image :src="item.img" mode="aspectFill" />
                  <view>{{ item.name }}</view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>

        <view>
          <view class="science-poisition">
            <view class="poisition-title">附近推荐</view>
            <view>看看身边的天津</view>
          </view>

          <view class="section-tabs" style="padding-left: 10px;">
            <view
              v-for="(tab, index) in ['景区景点', '酒店住宿', '美食餐饮']"
              :key="index"
              class="section-tab"
              :class="{ active: currentTab2 === index }"
              @click="switchTab2(index)"
            >
              {{ tab }}
              <view class="tab-indicator" v-if="currentTab2 === index"></view>
            </view>
          </view>
          <view class="poisition">
            <view v-for="(item, index) in poisitionList" :key="index" class="poisition-item">
              <image :src="item.img" />
              <view class="name">
                {{ item.name }}
              </view>
            </view>
          </view>
        </view>
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

const searchValue = ref('')
const state = ref({
  isScroll: false,
})
const activeIndex = ref(0)
const activeIndex1 = ref(0)
const activeIndex2 = ref(0)
const activeIndex3 = ref(0)
const activeIndex4 = ref(0)

const poisitionList = [
  { name: '烧仙草', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '烧仙草', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '烧仙草', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '烧仙草', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
]

const currentCity = ref('天津')
const topHeight = ref(0)
const isNavbarWhite = ref(false)

const bannerList = [
  'https://travel.tasiai.cn/FilePath/file/background481939721317265408.png',
  'https://travel.tasiai.cn/FilePath/file/background1481974387504066560.png',
]
const itineraryList = [
  { name: '[6日游]天津+天津', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '[6日游]天津+天津', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '[6日游]天津+天津', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '[6日游]天津+天津', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
]

const tabList = [
  { name: '景区', icon: 'https://travel.tasiai.cn/FilePath/file/jq481943985808748544.png' },
  // { name: '住宿', icon: 'https://travel.tasiai.cn/FilePath/file/jd481943945769922560.png' },
  { name: '美食', icon: 'https://travel.tasiai.cn/FilePath/file/ms481944049675415552.png' },
  { name: '特产', icon: 'https://travel.tasiai.cn/FilePath/file/tc481944121121189888.png' },
  { name: '演艺', icon: 'https://travel.tasiai.cn/FilePath/file/yy481944092138549248.png' },
  { name: '交通', icon: 'https://travel.tasiai.cn/FilePath/file/jt481944019363180544.png' },
  { name: '线路', icon: 'https://travel.tasiai.cn/FilePath/file/xl481972183342788608.png' },
  { name: '秒杀', icon: 'https://travel.tasiai.cn/FilePath/file/gw481943902077857792.png' },
  { name: '票务', icon: 'https://travel.tasiai.cn/FilePath/file/pw481971133000986624.png' },
  { name: '其他', icon: 'https://travel.tasiai.cn/FilePath/file/qt481971431618654208.png' },
]

const activityList1 = [
  'https://travel.tasiai.cn/FilePath/file/last482300419486527488.png',
  'https://travel.tasiai.cn/FilePath/file/last482300419486527488.png',
  'https://travel.tasiai.cn/FilePath/file/last482300419486527488.png',
  'https://travel.tasiai.cn/FilePath/file/last482300419486527488.png',
]

const promotionList1 = [
  { name: '[6日游]天津+天津', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '[6日游]天津+天津', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '[6日游]天津+天津', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
  { name: '[6日游]天津+天津', img: 'https://travel.tasiai.cn/FilePath/file/生成宣传图 (1)484827767398215680.png' },
]

const newsList = [
  { text: '品津味早点，逛百年津城' },
  { text: '一城烟火半河景，万般风情在天津' },
  { text: '听津腔曲艺，赏海河风光' },
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
const currentTab1 = ref(0)
const currentTab2 = ref(0)
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

const switchTab1 = index => {
  currentTab1.value = index
  nextTick(() => {
    if (index == 1) {
      activeIndex3.value = 1
    } else {
      activeIndex4.value = 1
    }
  })
}

const switchTab2 = index => {
  currentTab2.value = index
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
function onChange3(e) {
  activeIndex3.value = e.detail.current
}
function onChange4(e) {
  activeIndex4.value = e.detail.current
}
const currentActivityIndex = ref(0)

const paging = ref()

onLoad(options => {
  console.log('🚀 页面加载:', options)
  setTimeout(() => {
    activeIndex.value = 1
    activeIndex1.value = 1
    activeIndex2.value = 1

    activeIndex3.value = 1
    activeIndex4.value = 1
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
  vk.navigateTo('/pages_sub/index/city-select?city=' + currentCity.value)
}

function goToSearch() {
  vk.navigateTo('/pages/index/search')
}

function openThirdMiniProgram() {
  uni.navigateToMiniProgram({
    appId: 'wx2439aff7ed572585',
    success: function (res) {
      console.log('打开第三方小程序成功', res)
    },
    fail: function (err) {
      console.error('打开第三方小程序失败', err)
      uni.showToast({
        title: '打开失败，请重试',
        icon: 'none',
      })
    },
  })
}

function goTab() {
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
.poisition {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  overflow: hidden;

  .name {
    padding: 10px;
  }
  .poisition-item {overflow: hidden;
    border-radius: 15px;
    width: 49%;
    background: #fff;
    margin-bottom: 20rpx;
    image {
      width: 100%;
    }
  }
}
.science {
  font-size: 30rpx;
  color: #606465;
  margin: 30rpx 0;

  .science-back {
    display: flex;
    align-items: center;
    height: 100rpx;
    background: linear-gradient(135deg, #ccf7ed, #e6ecfc);
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;
    padding: 35rpx 20rpx;
  }
  .iscience-title {
    font-weight: bold;
    color: #333;
    font-size: 36rpx;
    margin-right: 20rpx;
  }
  .fixItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 20rpx;
    overflow: hidden;
    image {
      width: 49%;
    }
  }
}
.science-poisition {
  display: flex;
  align-items: center;
  height: 100rpx;

  padding: 35rpx 20rpx;
}
.poisition-title {
  font-weight: bold;
  color: #333;
  font-size: 36rpx;
  margin-right: 20rpx;
}
.promotion {
  font-size: 30rpx;
  color: #606465;
  margin: 30rpx 0;

  .promotion-back {
    display: flex;
    align-items: center;
    height: 100rpx;
    background: linear-gradient(135deg, #f8eee4, #f4ece4);
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;
    padding: 35rpx 20rpx;
  }
  .promotion-title {
    font-weight: bold;
    color: #333;
    font-size: 36rpx;
    margin-right: 20rpx;
  }
  .promotion-scroll {
    width: 100%;
    white-space: nowrap;
  }
  .promotion {
    display: inline-flex;
    gap: 20rpx;
    padding: 10rpx 0;
    .tab {
      width: 220rpx;
      flex-shrink: 0;
      image {
        width: 100%;
        height: 140rpx;
        border-radius: 12rpx;
      }
      view {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        margin-top: 8rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .fixItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 20rpx;
    overflow: hidden;
    image {
      width: 49%;
    }
  }
}

.interaction {
  font-size: 30rpx;
  color: #606465;
  margin-bottom: 30rpx;
  .fixItem {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
  }
  .interaction-title {
    font-weight: bold;
    color: #333;
    font-size: 36rpx;
    margin-right: 20rpx;
  }
  .itinerary-scroll {
    width: 100%;
    white-space: nowrap;
  }
  .itinerary {
    display: inline-flex;
    gap: 20rpx;
    padding: 10rpx 0;
    .tab {
      width: 220rpx;
      flex-shrink: 0;
      image {
        width: 100%;
        height: 140rpx;
        border-radius: 12rpx;
      }
      view {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        margin-top: 8rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.trip {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  view {
    width: 48%;
    color: #333;
    font-weight: bold;
    margin-bottom: 20rpx;
    padding: 30rpx;
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;
    text-align: center;
    font-size: 34rpx;

    &:first-child {
      background: linear-gradient(135deg, #92ebd1, #f0f9f8);
    }
    &:nth-child(2) {
      background: linear-gradient(135deg, #fdbfd8, #faf0f6);
    }
    &:nth-child(3) {
      background: linear-gradient(135deg, #fddc77, #f9f6ed);
    }
    &:last-child {
      background: linear-gradient(135deg, #fecebd, #faf6f5);
    }
  }
}
.page-container {
  width: 100%;
  height: calc(100vh - 166rpx);
  background: #f2fafc;
}
::v-deep .u-input {
  height: 36rpx;
}
.scroll-content {
  padding-bottom: 120rpx;
}

.navbar-content.navbar-white {
  background: #fff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
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
  height: 198rpx;
  box-sizing: border-box;
  padding-top: 64rpx;
  width: 100%;
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
.tabActivity1 {
  border-radius: 20rpx;
  padding: 36rpx 17rpx;
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
.tabActivity,
.tabActivity1 {
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
  /* 轮播高度 */
  .swiper1 {
    width: 100%;
    height: 198rpx;
  }

  /* 卡片样式 */
  .card1 {
    width: 100%;
    height: 198rpx;
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

  /* 图片铺满 */
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

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}
.borad {
  width: 100%;
  height: 384rpx;
  overflow: hidden;
  border-radius: 15rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.news-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.news-search {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  border-radius: 32rpx;
  gap: 12rpx;
  border: 4rpx solid #3bddab;
  width: 336rpx;
}

.news-search .search-icon {
  font-size: 28rpx;
}

.news-search .search-placeholder {
  font-size: 26rpx;
  color: #999;
}

.news-carousel {
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  color: #1acfdc;

  display: flex;
  align-items: center;
  .tag {
    border-radius: 15rpx;
    color: #333;
    width: 150rpx;
    height: 60rpx;
    text-align: center;
    background: #84e8cb;
    line-height: 60rpx;
  }
}
.text-swiper {
  height: 38rpx;
  width: 400rpx;
  margin-left: 40rpx;
}

.news-item {
  display: flex;
  align-items: center;
}

.news-tag {
  padding: 4rpx 12rpx;
  background: linear-gradient(135deg, #ff6b6b, #ff8c8c);
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
}

.news-text {
  font-size: 28rpx;
  color: #1acfdc;
}
</style>
