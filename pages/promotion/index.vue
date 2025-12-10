<template>
  <view>
    <button @tap="startRecord">开始录音</button>
    <button @tap="pauseRecord">暂停录音</button>
    <button @tap="resumeRecord">继续录音</button>
    <button @tap="stopRecord">停止录音</button>
    <button @tap="playRecord">播放录音</button>
  </view>
</template>

<script>
  import jzRecorder from '@/uni_modules/jz-h5RecorderManager/js/index.js'
  console.log('🚀 ~ :13 ~ jzRecorder:', jzRecorder)

  export default {
    data() {
      return {
        recorderManager: null,
        audioContext: null,
        recordFile: null
      }
    },

    onLoad() {
      // 获取录音管理器
      this.recorderManager = jzRecorder.getRecorderManager()

      // 获取音频播放器
      this.audioContext = uni.createInnerAudioContext()
      this.audioContext.autoplay = true

      // 监听录音事件
      this.initRecorderEvents()
    },

    methods: {
      // 初始化录音事件监听
      initRecorderEvents() {
        // 录音开始
        this.recorderManager.onStart(() => {
          console.log('录音开始')
          uni.showToast({ title: '录音开始', icon: 'none' })
        })

        // 录音暂停
        this.recorderManager.onPause(() => {
          console.log('录音暂停')
          uni.showToast({ title: '录音暂停', icon: 'none' })
        })

        // 录音继续
        this.recorderManager.onResume(() => {
          console.log('录音继续')
          uni.showToast({ title: '录音继续', icon: 'none' })
        })

        // 录音停止
        this.recorderManager.onStop(res => {
          console.log('录音停止', res)
          this.recordFile = res.tempFilePath
          uni.showToast({
            title: `录音完成，时长：${res.duration}秒`,
            icon: 'none'
          })
        })

        // 录音错误
        this.recorderManager.onError(err => {
          console.error('录音错误', err)
          uni.showToast({ title: err.errMsg, icon: 'none' })
        })
      },

      // 开始录音
      startRecord() {
        this.recorderManager.start({
          duration: 60000, // 录音时长60秒
          sampleRate: 44100, // 采样率
          numberOfChannels: 1, // 声道数
          encodeBitRate: 192000, // 编码码率
          format: 'mp3' // 录音格式
        })
      },

      // 暂停录音
      pauseRecord() {
        this.recorderManager.pause()
      },

      // 继续录音
      resumeRecord() {
        this.recorderManager.resume()
      },

      // 停止录音
      stopRecord() {
        this.recorderManager.stop()
      },

      // 播放录音
      playRecord() {
        if (this.recordFile) {
          this.audioContext.src = this.recordFile
          this.audioContext.play()
        } else {
          uni.showToast({ title: '请先录音', icon: 'none' })
        }
      }
    },

    onUnload() {
      // 清理资源
      if (this.audioContext) {
        this.audioContext.destroy()
      }
    }
  }
</script>
