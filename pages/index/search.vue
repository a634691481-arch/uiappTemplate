<template>
  <view class="search-page">
    <view class="search-header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input class="search-input" v-model="searchValue" placeholder="搜索文旅资讯" @confirm="handleSearch" />
        <text class="clear-btn" v-if="searchValue" @click="clearSearch">✕</text>
      </view>
    </view>

    <view class="hot-section">
      <view class="section-header">
        <text class="section-title">🔥 热搜排行</text>
        <text class="section-more" @click="refreshHot">换一批</text>
      </view>

      <view class="hot-list">
        <view
          v-for="(item, index) in hotList"
          :key="index"
          class="hot-item"
          :class="{ top: index < 3 }"
          @click="searchKeyword(item.keyword)"
        >
          <view class="rank-badge" :class="getRankClass(index)">
            {{ index + 1 }}
          </view>
          <view class="hot-content">
            <text class="hot-keyword">{{ item.keyword }}</text>
            <text class="hot-count">搜索 {{ item.count }} 次</text>
          </view>
          <view class="hot-trend" :class="item.trend">
            {{ item.trend === 'up' ? '↑' : '↓' }}
          </view>
        </view>
      </view>
    </view>

    <view class="history-section">
      <view class="section-header">
        <text class="section-title">📝 搜索历史</text>
        <text class="section-more" @click="clearHistory">清空</text>
      </view>

      <view class="history-list" v-if="historyList.length > 0">
        <view v-for="(item, index) in historyList" :key="index" class="history-item" @click="searchKeyword(item)">
          <text class="history-keyword">{{ item }}</text>
          <text class="history-delete" @click.stop="deleteHistory(index)">✕</text>
        </view>
      </view>
      <view class="empty-history" v-else>
        <text class="empty-text">暂无搜索历史</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { ref } from 'vue'

  const searchValue = ref('')

  const hotList = ref([
    { keyword: '天津旅游攻略', count: 12580, trend: 'up' },
    { keyword: '五一出游推荐', count: 9860, trend: 'up' },
    { keyword: '网红打卡地', count: 8520, trend: 'down' },
    { keyword: '文化遗产景点', count: 6340, trend: 'up' },
    { keyword: '美食推荐', count: 5890, trend: 'down' },
    { keyword: '亲子游', count: 4560, trend: 'up' },
    { keyword: '周边游', count: 3820, trend: 'down' },
    { keyword: '自驾游路线', count: 3150, trend: 'up' },
  ])

  const historyList = ref(['天津旅游', '美食', '攻略'])

  const getRankClass = index => {
    if (index === 0) return 'rank-1'
    if (index === 1) return 'rank-2'
    if (index === 2) return 'rank-3'
    return ''
  }

  const handleSearch = () => {
    if (!searchValue.value.trim()) return
    searchKeyword(searchValue.value)
  }

  const searchKeyword = keyword => {
    searchValue.value = keyword

    if (!historyList.value.includes(keyword)) {
      historyList.value.unshift(keyword)
      if (historyList.value.length > 10) {
        historyList.value.pop()
      }
    }

    uni.showToast({
      title: '搜索: ' + keyword,
      icon: 'none',
    })
  }

  const clearSearch = () => {
    searchValue.value = ''
  }

  const goBack = () => {
    uni.navigateBack({
      fail: () => {
        uni.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  }

  const refreshHot = () => {
    uni.showToast({
      title: '刷新成功',
      icon: 'none',
    })
  }

  const clearHistory = () => {
    historyList.value = []
    uni.showToast({
      title: '已清空',
      icon: 'none',
    })
  }

  const deleteHistory = index => {
    historyList.value.splice(index, 1)
  }
</script>

<style lang="scss" scoped>
  .search-page {
    min-height: 100vh;
    background: #f5f5f5;
  }

  .search-header {
    display: flex;
    align-items: center;
    padding: 100rpx 20rpx 31rpx;
    background: #fff;
    gap: 16rpx;
  }

  .back-btn {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    border-radius: 50%;
  }

  .back-icon {
    font-size: 36rpx;
    color: #333;
  }

  .search-input-wrap {
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
    background: #f0f0f0;
    border-radius: 40rpx;
    gap: 16rpx;
  }

  .search-icon {
    font-size: 32rpx;
  }

  .search-input {
    flex: 1;
    font-size: 30rpx;
    background: transparent;
  }

  .clear-btn {
    font-size: 28rpx;
    color: #999;
    padding: 8rpx;
  }

  .hot-section {
    margin: 20rpx;
    padding: 24rpx;
    background: #fff;
    border-radius: 16rpx;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }

  .section-more {
    font-size: 26rpx;
    color: #999;
  }

  .hot-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .hot-item {
    display: flex;
    align-items: center;
    padding: 12rpx 0;

    &.top {
      padding: 16rpx 16rpx;
      background: #fff8f0;
      border-radius: 12rpx;
      margin: -8rpx -16rpx;
      margin-bottom: 12rpx;

      &:nth-child(1) {
        margin-top: -16rpx;
      }
    }
  }

  .rank-badge {
    width: 44rpx;
    height: 44rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f0f0f0;
    border-radius: 8rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #666;
    margin-right: 20rpx;

    &.rank-1 {
      background: linear-gradient(135deg, #ff4d4f, #ff7875);
      color: #fff;
      font-size: 30rpx;
    }

    &.rank-2 {
      background: linear-gradient(135deg, #fa8c16, #ffa940);
      color: #fff;
      font-size: 30rpx;
    }

    &.rank-3 {
      background: linear-gradient(135deg, #faad14, #ffc53d);
      color: #fff;
      font-size: 30rpx;
    }
  }

  .hot-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }

  .hot-keyword {
    font-size: 30rpx;
    color: #333;
  }

  .hot-count {
    font-size: 22rpx;
    color: #999;
  }

  .hot-trend {
    font-size: 28rpx;

    &.up {
      color: #ff4d4f;
    }

    &.down {
      color: #52c41a;
    }
  }

  .history-section {
    margin: 0 20rpx 20rpx;
    padding: 24rpx;
    background: #fff;
    border-radius: 16rpx;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .history-item {
    display: flex;
    align-items: center;
    padding: 12rpx 24rpx;
    background: #f8f9fa;
    border-radius: 24rpx;
    gap: 12rpx;
  }

  .history-keyword {
    font-size: 28rpx;
    color: #666;
  }

  .history-delete {
    font-size: 24rpx;
    color: #ccc;
  }

  .empty-history {
    padding: 40rpx;
    text-align: center;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
</style>
