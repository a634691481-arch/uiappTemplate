<template>
  <view class="city-select-page">
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">选择城市</text>
      <view class="nav-placeholder"></view>
    </view>
    
    <view class="content">
      <view class="location-section">
        <view class="location-btn" @click="getCurrentLocation">
          <view class="location-icon">📍</view>
          <view class="location-text">
            <text class="location-title">获取当前位置</text>
            <text class="location-hint">{{ currentLocation || '点击获取位置' }}</text>
          </view>
          <view class="location-arrow">→</view>
        </view>
      </view>
      
      <view class="city-list-section">
        <view class="section-title">热门城市</view>
        <view class="city-grid">
          <view 
            v-for="city in cityList" 
            :key="city" 
            class="city-item"
            :class="{ active: selectedCity === city }"
            @click="selectCity(city)"
          >
            {{ city }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const currentLocation = ref('')
const selectedCity = ref('')

const cityList = [
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
  '蓟州区'
]

onLoad(options => {
  if (options?.city) {
    selectedCity.value = options.city
  }
})

function goBack() {
  uni.navigateBack()
}

function getCurrentLocation() {
  uni.showLoading({ title: '获取位置中...' })
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      uni.hideLoading()
      uni.request({
        url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77`,
        success: (result) => {
          if (result.data && result.data.result) {
            const address = result.data.result.address_component
            const district = address.district || address.city || '天津'
            currentLocation.value = `当前位置：${district}`
            selectedCity.value = district
          }
        },
        fail: () => {
          currentLocation.value = '获取位置失败，请手动选择'
        }
      })
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({ title: '获取位置失败', icon: 'none' })
    }
  })
}

function selectCity(city) {
  selectedCity.value = city
  uni.$emit('cityChange', city)
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.city-select-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60rpx 30rpx 30rpx;
  background: #fff;
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
}

.nav-placeholder {
  width: 60rpx;
}

.content {
  padding: 20rpx 30rpx;
}

.location-section {
  margin-bottom: 30rpx;
}

.location-btn {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
}

.location-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.location-text {
  flex: 1;
}

.location-title {
  display: block;
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.location-hint {
  font-size: 26rpx;
  color: #999;
}

.location-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.city-list-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}

.section-title {
  font-size: 30rpx;
  color: #666;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
}

.city-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.city-item {
  padding: 24rpx 36rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
}

.city-item.active {
  background: #07c160;
  color: #fff;
}
</style>