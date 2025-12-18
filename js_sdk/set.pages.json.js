// 监听 pages 目录下的文件变动，实时更新 pages.json
// 监听 subPackages 目录下的文件变动，实时更新 pages.json
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const ora = require('ora')

const pagesDir = path.resolve(__dirname, '../pages')
const pagesJsonPath = path.resolve(__dirname, '../pages.json')

let optsArg = process.argv.find(a => typeof a === 'string' && a.startsWith('--options='))
let options = {}
if (optsArg) {
  try {
    const b64 = optsArg.split('=')[1] || ''
    const json = Buffer.from(b64, 'base64').toString('utf8')
    options = JSON.parse(json)
  } catch {}
}
const subPackages = Array.isArray(options.subPackages) ? options.subPackages : []

const defaultPageStyle = {
  disableScroll: true,
  enablePullDownRefresh: false
}

function scanPages(dir) {
  let pages = []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      pages = pages.concat(scanPages(fullPath))
    } else if (file.isFile() && file.name.endsWith('.vue')) {
      const relPath = path.relative(path.resolve(__dirname, '..'), fullPath)
      const pagePath = relPath.replace(/\\/g, '/').replace(/\.vue$/, '')
      pages.push(pagePath)
    }
  }
  return pages
}

function scanSubPackage(root, baseRoot = root) {
  const dir = path.resolve(__dirname, '..', root)
  if (!fs.existsSync(dir)) return []
  let pages = []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const full = path.join(dir, file.name)
    if (file.isDirectory()) {
      pages = pages.concat(scanSubPackage(path.join(root, file.name), baseRoot))
    } else if (file.isFile() && file.name.endsWith('.vue')) {
      const rel = path.relative(path.resolve(__dirname, '..', baseRoot), full)
      const page = rel.replace(/\\/g, '/').replace(/\.vue$/, '')
      pages.push(page)
    }
  }
  return pages
}

function updatePagesJson() {
  const spinner = ora('检测到页面变动，正在更新 pages.json...').start()
  try {
    if (!fs.existsSync(pagesJsonPath)) {
      spinner.fail('未找到 pages.json')
      return
    }
    const physicalPages = scanPages(pagesDir)
    const rawData = fs.readFileSync(pagesJsonPath, 'utf8')
    let config = {}
    try {
      config = JSON.parse(rawData)
    } catch {
      try {
        const stripped = rawData.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
        config = JSON.parse(stripped)
      } catch {
        spinner.fail('pages.json 解析失败')
        return
      }
    }
    if (!Array.isArray(config.pages)) config.pages = []
    const existingPaths = new Set(config.pages.map(p => p.path))
    const physicalSet = new Set(physicalPages)
    let hasChanges = false
    for (const p of physicalPages) {
      if (!existingPaths.has(p)) {
        config.pages.push({ path: p, style: { ...defaultPageStyle } })
        hasChanges = true
        console.log(chalk.green(`\n[新增页面] ${p}`))
      }
    }
    const newPages = config.pages.filter(p => {
      if (!physicalSet.has(p.path)) {
        hasChanges = true
        console.log(chalk.red(`\n[删除页面] ${p.path}`))
        return false
      }
      return true
    })
    config.pages = newPages
    if (!Array.isArray(config.subPackages)) config.subPackages = []
    for (const root of subPackages) {
      const phys = scanSubPackage(root)
      const pkgIndex = config.subPackages.findIndex(sp => sp && sp.root === root)
      const physSet = new Set(phys)
      if (pkgIndex === -1) {
        if (phys.length > 0) {
          const pages = phys.map(p => ({ path: p, style: { ...defaultPageStyle } }))
          config.subPackages.push({ root, pages })
          hasChanges = true
          console.log(chalk.green(`\n[新增分包] ${root} (${phys.length} 页)`))
        }
      } else {
        const pkg = config.subPackages[pkgIndex]
        if (!Array.isArray(pkg.pages)) pkg.pages = []
        const existSet = new Set(pkg.pages.map(p => p.path))
        for (const p of phys) {
          if (!existSet.has(p)) {
            pkg.pages.push({ path: p, style: { ...defaultPageStyle } })
            hasChanges = true
            console.log(chalk.green(`\n[分包新增页面] ${root}/${p}`))
          }
        }
        const filtered = pkg.pages.filter(p => {
          if (!physSet.has(p.path)) {
            hasChanges = true
            console.log(chalk.red(`\n[分包删除页面] ${root}/${p.path}`))
            return false
          }
          return true
        })
        pkg.pages = filtered
      }
    }
    const keepRoots = new Set(subPackages)
    config.subPackages = config.subPackages.filter(sp => keepRoots.has(sp.root))
    // 按需重排键顺序：确保 subPackages 紧贴在 pages 之后
    const ordered = {}
    const preferOrder = ['easycom', 'pages', 'subPackages', 'globalStyle', 'tabBar']
    for (const k of preferOrder) {
      if (Object.prototype.hasOwnProperty.call(config, k)) {
        ordered[k] = config[k]
      }
    }
    for (const k of Object.keys(config)) {
      if (!Object.prototype.hasOwnProperty.call(ordered, k)) {
        ordered[k] = config[k]
      }
    }
    const newContent = JSON.stringify(ordered, null, 2)
    if (updatePagesJson.lastWritten !== newContent) {
      fs.writeFileSync(pagesJsonPath, newContent, 'utf8')
      updatePagesJson.lastWritten = newContent
      spinner.succeed('pages.json 已自动更新')
    } else {
      spinner.stop()
    }
  } catch (err) {
    ora().fail(`更新失败: ${err.message}`)
  }
}

function startWatcher() {
  console.log()
  console.log(chalk.blue.bold('  📂 正在监听 pages 与分包目录自动更新 pages.json...'))
  console.log()
  for (const root of subPackages) {
    const dir = path.resolve(__dirname, '..', root)
    if (!fs.existsSync(dir)) {
      // 创建根目录
      fs.mkdirSync(dir, { recursive: true })

      const idxDir = path.join(dir, 'index')
      fs.mkdirSync(idxDir, { recursive: true })

      const fp = path.join(idxDir, 'index.vue')
      if (!fs.existsSync(fp)) {
        fs.writeFileSync(
          fp,
          '<template>\n  <view>分包默认首页</view>\n</template>\n<script setup>\n</script>\n<style lang="scss" scoped>\n</style>\n',
          'utf8'
        )
      }
    }
  }
  updatePagesJson()
  const watchDirs = [pagesDir, ...subPackages.map(r => path.resolve(__dirname, '..', r))]
  const watcher = chokidar.watch(watchDirs, {
    persistent: true,
    ignoreInitial: true,
    ignorePermissionErrors: true,
    depth: 99
  })

  let pending = false
  const schedule = () => {
    if (pending) return
    pending = true
    setTimeout(() => {
      pending = false
      updatePagesJson()
    }, 500)
  }

  watcher
    .on('add', filePath => {
      if (filePath.endsWith('.vue')) {
        console.log(chalk.gray(`[文件变动] add: ${filePath}`))
        schedule()
      }
    })
    .on('unlink', filePath => {
      if (filePath.endsWith('.vue')) {
        console.log(chalk.gray(`[文件变动] unlink: ${filePath}`))
        schedule()
      }
    })
    .on('addDir', () => schedule())
    .on('unlinkDir', () => schedule())
}

startWatcher()
