import path from 'path'
import { spawn } from 'child_process'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
// import autoPagesJson from './js_sdk/a-hua-auto-pages-json'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import { codeInspectorPlugin } from 'code-inspector-plugin'

// 辅助函数：创建自动运行脚本的 Vite 插件
const createAutoRunPlugin = (name, scriptPath, args = []) => {
  let hasStarted = false
  return {
    name: `auto-run-${name}`,
    configureServer() {
      if (hasStarted) return
      hasStarted = true
      console.log(`🚀 启动 ${name} 服务...`)
      const child = spawn('node', [scriptPath, ...args], {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname
      })
      child.on('error', err => console.error(`❌ ${name} 启动失败:`, err))
      process.on('exit', () => child.kill())
    }
  }
}

// 注意： 打包成 h5 和 app 都不需要开启插件配置
const isH5 = process.env.UNI_PLATFORM === 'h5'
const isApp = process.env.UNI_PLATFORM === 'app'
const WeappTailwindcssDisabled = isH5 || isApp

const resolve = p => {
  return path.resolve(__dirname, p)
}

export default defineConfig({
  plugins: [
    createAutoRunPlugin('图片重命名', './set.images.prefix.js', ['./static']),
    createAutoRunPlugin('Pages自动更新', './set.pages.json.js'),
    codeInspectorPlugin({
      bundler: 'vite',
      // showSwitch: true,
      hideDomPathAttr: true
    }),
    uni(),
    uvwt({
      rem2rpx: true,
      disabled: WeappTailwindcssDisabled,
      // 由于 hbuilderx 会改变 process.cwd 所以这里必须传入当前目录的绝对路径
      tailwindcssBasedir: __dirname
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      imports: ['vue', 'uni-app'],
      dts: 'typings/auto-imports.d.ts'
    })
  ],
  css: {
    postcss: {
      plugins: [
        require('tailwindcss')({
          // 注意此处，手动传入你 `tailwind.config.js` 的绝对路径
          config: resolve('./tailwind.config.js')
        }),
        require('autoprefixer')
      ]
    }
  }
})
