<template>
  <view class="size-full animate-fadeIn bg-white/90 flex fixed inset-0 flex-col justify-center items-center">
    <view class="loader animate-scaleIn"></view>
    <view class="mt-1 text-base">loading</view>
  </view>
</template>

<script setup>
  // 组件名称
  defineOptions({ name: 'yy-loading' })
</script>

<style lang="scss" scoped>
  .loader {
    width: 50px;
    --b: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, #18c9d9) content-box;
    -webkit-mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
      radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
    animation: l4 1s infinite steps(10);
  }
  @keyframes l4 {
    to {
      transform: rotate(1turn);
    }
  }
</style>
