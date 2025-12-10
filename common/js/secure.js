const secureModule = {
  secure() {
    // plus.runtime.quit()
    // plus.ios.import('UIApplication').sharedApplication().performSelector('exit')
    // #ifdef APP-PLUS
    if (plus.navigator.isSimulator()) {
      //弹出提示框
      vk.alert('应用被不能运行到模拟器！', '错误提示', () => {
        plus.runtime.quit()
      })
    }
    if (plus.navigator.isRoot()) {
      vk.alert('应用被不能运行到越狱或ROOT环境！', '错误提示', () => {
        plus.runtime.quit()
      })
    }
    // #endif
  }
}

// 导出登录模块
export default secureModule
