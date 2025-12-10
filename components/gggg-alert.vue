<template>
  <view class="size-full bg-black/60 flex fixed inset-0 justify-center items-center" v-if="options.show">
    <transition name="alert-scale" appear>
      <view class="w-[80%] bg-white rounded-[1rem]" v-if="options.show">
        <view class="flex flex-col gap-4 justify-center items-center p-4 py-5">
          <view class="text-[1rem] text-[#161A24] font-medium" v-if="options.title">{{ options.title }}</view>
          <view class="text-[.875rem] text-[#5C6068] text-center px-8">{{ options.describe }}</view>
        </view>
        <view class="grid grid-cols-2 border-t-[.0625rem]">
          <view class="flex col-span-1 justify-center items-center border-r-[.0625rem] py-3" @click="close">
            <text :style="{ color: options.cancelColor }" class="text-[1rem] text-[#161A24]">
              {{ options.cancel }}
            </text>
          </view>
          <view class="flex col-span-1 justify-center items-center py-3" @click="confirm">
            <text :style="{ color: options.confirmColor }" class="font-medium text-[1rem] text-[#161A24]">
              {{ options.confirm }}
            </text>
          </view>
        </view>
      </view>
    </transition>
  </view>
</template>

<script setup>
  // <tasi-alert ref="alert" @alertConfirm="handleAlertConfirm"></tasi-alert>

  const emit = defineEmits(['alertConfirm'])

  const options = reactive({
    show: false,
    title: '温馨提示',
    describe: '确定要执行此操作吗？',
    cancel: '取消',
    confirm: '确定',
    cancelColor: '#5C6068',
    confirmColor: '#FF3A56',
    eventType: 'confirm'
  })

  const close = () => {
    Object.assign(options, { show: false })
  }

  const confirm = () => {
    emit('alertConfirm', options.eventType)
    Object.assign(options, { show: false })
  }

  const config = opts => {
    Object.assign(options, opts)
  }

  defineExpose({
    config
  })
</script>

<style scoped>
  /* 背景遮罩淡入淡出动画 */
  .alert-fade-enter-active,
  .alert-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .alert-fade-enter-from,
  .alert-fade-leave-to {
    opacity: 0;
  }

  /* 弹窗内容缩放动画 */
  .alert-scale-enter-active,
  .alert-scale-leave-active {
    transition: all 0.3s ease;
  }

  .alert-scale-enter-from,
  .alert-scale-leave-to {
    opacity: 0;
    transform: scale(0.7);
  }

  .alert-scale-enter-to,
  .alert-scale-leave-from {
    opacity: 1;
    transform: scale(1);
  }
</style>
