const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const ora = require('ora')

const pagesDir = path.resolve(__dirname, 'pages')
const pagesJsonPath = path.resolve(__dirname, 'pages.json')

// 默认页面配置样式
const defaultPageStyle = {
  disableScroll: true,
  enablePullDownRefresh: false
}

// 扫描所有 .vue 页面文件
function scanPages(dir) {
  let pages = []
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      pages = pages.concat(scanPages(fullPath))
    } else if (file.isFile() && file.name.endsWith('.vue')) {
      // 排除非页面组件（如果pages下有components目录或非页面vue文件，可在此过滤）
      // 简单规则：假设 pages 下所有 vue 都是页面
      // 生成路径：pages/index/index
      const relPath = path.relative(__dirname, fullPath)
      // 转换为 forward slashes
      const pagePath = relPath.replace(/\\/g, '/').replace(/\.vue$/, '')
      pages.push(pagePath)
    }
  }
  return pages
}

// 更新 pages.json
function updatePagesJson() {
  const spinner = ora('检测到页面变动，正在更新 pages.json...').start()

  try {
    if (!fs.existsSync(pagesJsonPath)) {
      spinner.fail('未找到 pages.json')
      return
    }

    // 1. 获取当前所有物理存在的页面路径
    const physicalPages = scanPages(pagesDir)

    // 2. 读取现有 pages.json
    const rawData = fs.readFileSync(pagesJsonPath, 'utf8')
    // 使用简单的正则或 JSON.parse (需注意注释)
    // 简单起见，这里假设 pages.json 是标准 JSON (uni-app 项目通常是 jsonc，可能有注释)
    // 为了稳健，我们尝试用 Function 或 eval 来解析 (如果包含注释)，或者用 strip-json-comments
    // 这里简单处理：如果 JSON.parse 失败，提示用户检查格式
    let config = {}
    try {
      config = JSON.parse(rawData)
    } catch (e) {
      // 尝试去除注释
      try {
        const stripped = rawData.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
        config = JSON.parse(stripped)
      } catch (e2) {
        spinner.fail('pages.json 解析失败，请检查是否包含非标准 JSON 语法')
        return
      }
    }

    if (!Array.isArray(config.pages)) {
      config.pages = []
    }

    // 3. 增量更新逻辑
    // - 物理存在但配置中不存在 -> 新增
    // - 配置中存在但物理不存在 -> 删除
    // - 保持原有配置的顺序和自定义属性不变

    const existingPaths = new Set(config.pages.map(p => p.path))
    const physicalSet = new Set(physicalPages)

    let hasChanges = false

    // 检查新增
    for (const p of physicalPages) {
      if (!existingPaths.has(p)) {
        config.pages.push({
          path: p,
          style: { ...defaultPageStyle }
        })
        hasChanges = true
        console.log(chalk.green(`\n[新增页面] ${p}`))
      }
    }

    // 检查删除
    const newPages = config.pages.filter(p => {
      if (!physicalSet.has(p.path)) {
        hasChanges = true
        console.log(chalk.red(`\n[删除页面] ${p.path}`))
        return false
      }
      return true
    })

    if (hasChanges) {
      config.pages = newPages
      fs.writeFileSync(pagesJsonPath, JSON.stringify(config, null, 2), 'utf8') // uni-app pages.json 通常 2 空格缩进
      spinner.succeed('pages.json 已自动更新')
    } else {
      spinner.stop()
    }
  } catch (err) {
    spinner.fail(`更新失败: ${err.message}`)
  }
}

// 启动监听
function startWatcher() {
  console.log()
  console.log(chalk.blue.bold('  📂 正在监听 pages 目录自动更新 pages.json...'))
  console.log()

  // 初始运行一次
  updatePagesJson()

  const watcher = chokidar.watch(pagesDir, {
    persistent: true,
    ignoreInitial: true,
    ignorePermissionErrors: true
  })

  // 监听新增和删除
  watcher
    .on('add', filePath => {
      if (filePath.endsWith('.vue')) updatePagesJson()
    })
    .on('unlink', filePath => {
      if (filePath.endsWith('.vue')) updatePagesJson()
    })
}

startWatcher()
