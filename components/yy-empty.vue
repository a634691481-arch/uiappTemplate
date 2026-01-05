<template>
  <view>
    <view class="flex flex-col items-center justify-center" @click="reloadClick">
      <view class="w-[30vw]" :style="{ 'margin-top': margin }">
        <u-image mode="widthFix" :src="url"></u-image>
      </view>
      <text class="mt-3 text-xs text-gray-500">{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
  // 定义 props
  const props = defineProps({
    url: {
      type: String,
      default: '/static/20251107162321.png'
    },
    text: {
      type: String,
      default: '暂无数据~'
    },
    margin: {
      type: String,
      default: '5vh'
    }
  })

  // 定义 emits
  const emit = defineEmits(['reload'])

  // 点击事件
  const reloadClick = () => {
    emit('reload')
  }
</script>
<style lang="scss" scoped>
  ::v-deep u-image view,
  u-image,
  .u-image {
    width: 100% !important;
    height: 100% !important;
    flex-grow: 1 !important;
  }
</style>
