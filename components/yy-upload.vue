<template>
  <view class="yy-upload">
    <u-upload
      :action="action"
      :header="header"
      :file-list="fileList"
      @on-success="onSuccess"
      @on-remove="onRemove"
      @on-uploaded="onUploaded"
      :max-count="maxCount"
      :multiple="multiple"
      :auto-upload="autoUpload"
      :show-progress="showProgress"
      :deletable="deletable"
      :max-size="maxSize"
      v-bind="$attrs"
      ref="uUpload"
    ></u-upload>
  </view>
</template>
<!-- 绑定字符串格式 -->
<!-- <yy-upload v-model="state.images" :max-count="3"></yy-upload> -->

<!-- 绑定数组格式 -->
<!-- <yy-upload v-model="state.imgList" :max-count="9"></yy-upload> -->
<script setup>
  /**
   * yy-upload 图片上传组件封装
   * @description 基于 VkuView u-upload 封装，统一处理上传地址和 Token
   * @property {Array} modelValue / v-model 绑定文件列表，格式为 [{url: 'xxx'}] 或 ['url1', 'url2']
   * @property {Number} maxCount 最大选择图片的数量
   * @property {Boolean} multiple 是否开启图片多选
   * @property {Boolean} autoUpload 是否选择完图片后自动上传
   * @property {Number} maxSize 允许上传的最大文件大小，单位字节
   */
  const props = defineProps({
    modelValue: {
      type: [Array, String],
      default: () => []
    },
    maxCount: {
      type: [Number, String],
      default: 9
    },
    multiple: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    deletable: {
      type: Boolean,
      default: true
    },
    maxSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    }
  })

  const emit = defineEmits(['update:modelValue', 'change', 'on-success', 'on-remove'])

  const action = import.meta.env.VITE_UPLOAD_BASE_URL
  const header = computed(() => {
    const token = uni.vk.getStorageSync('uni_id_token')
    return {
      token: token || ''
    }
  })

  // 内部维护的文件列表，用于展示
  const fileList = ref([])
  // const imagesList = ref([])

  // 初始化文件列表
  // watch(
  //   () => props.modelValue,
  //   val => {
  //     if (!val) {
  //       fileList.value = []
  //       return
  //     }
  //     const list = Array.isArray(val) ? val : val.split(',').filter(Boolean)
  //     fileList.value = list.map(item => {
  //       if (typeof item === 'string') {
  //         return { url: item }
  //       }
  //       return item
  //     })
  //   },
  //   { immediate: true }
  // )

  // 上传成功
  const onSuccess = (data, index, lists, name) => {
    const url = data?.data?.fullurl

    if (url) {
      fileList.value.push({ url })
      console.log('📝 更新后的fileList:', fileList.value)
      updateModelValue()
    }
    emit('on-success', data, index, lists, name)
  }

  // 移除图片
  const onRemove = (index, lists, name) => {
    fileList.value.splice(index, 1)
    updateModelValue()
    emit('on-remove', index, lists, name)
  }

  // 所有图片上传完成
  const onUploaded = lists => {
    // console.log('所有图片上传完成:', lists)
  }

  // 更新父组件绑定的值
  const updateModelValue = () => {
    const urls = fileList.value.map(item => item.url).filter(Boolean)
    // 如果初始传入的是字符串，则返回逗号分隔的字符串
    if (typeof props.modelValue === 'string') {
      emit('update:modelValue', urls.join(','))
    } else {
      emit('update:modelValue', urls)
    }
    emit('change', urls)
  }
</script>

<script>
  export default {
    name: 'yy-upload',
    inheritAttrs: false
  }
</script>

<style lang="scss" scoped>
  .yy-upload {
    width: 100%;
  }
</style>
