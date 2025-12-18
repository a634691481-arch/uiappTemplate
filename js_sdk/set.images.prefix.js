// 监听 static 文件夹下所有的图片，将非时间戳命名的图片重命名为时间戳格式
// 功能：实时监听 static 目录，自动重命名新增或修改的图片文件

const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const ora = require('ora')

// 从命令行参数获取监听路径
const targetPath = process.argv[2]

if (!targetPath) {
  console.log()
  console.log(chalk.red.bold('  ❌ 错误: 缺少路径参数'))
  console.log()
  console.log(chalk.cyan.bold('  📖 用法:'))
  console.log(chalk.gray('    node set.images.prefix.js <监听路径>'))
  console.log()
  console.log(chalk.cyan.bold('  📚 示例:'))
  console.log(chalk.green('    node set.images.prefix.js ./static'))
  console.log(chalk.green('    node set.images.prefix.js C:/Users/xxx/Desktop/images'))
  console.log(chalk.yellow('    node set.images.prefix.js ../assets/images'))
  console.log()
  process.exit(1)
}

// 将相对路径转换为绝对路径
const staticDir = path.isAbsolute(targetPath) ? targetPath : path.resolve(__dirname, targetPath)

function isTimestampName(filename) {
  const nameWithoutExt = path.parse(filename).name
  // 匹配 20251107114812 或 20251210161451123 或 20251210161451123_1 这种格式
  return /^\d{14,17}(_\d+)?$/.test(nameWithoutExt)
}

// 生成日期时间格式文件名（YYYYMMDDHHMMSS + 毫秒）
function generateTimestampName(originalPath) {
  const ext = path.extname(originalPath)
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')

  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`
  return `${timestamp}${ext}`
}

function renameImageFile(filePath) {
  const filename = path.basename(filePath)
  const dir = path.dirname(filePath)
  const relativePath = path.relative(staticDir, filePath)

  // 如果已经是日期时间格式命名，跳过
  if (isTimestampName(filename)) {
    console.log(chalk.gray(`  跳过: ${relativePath}`))
    return
  }

  let newName = generateTimestampName(filePath)
  let newPath = path.join(dir, newName)
  let counter = 1

  // 如果文件名已存在，添加序号后缀（在扩展名之前）
  while (fs.existsSync(newPath)) {
    const ext = path.extname(filePath)
    const nameWithoutExt = path.parse(newName).name
    newName = `${nameWithoutExt}_${counter}${ext}`
    newPath = path.join(dir, newName)
    counter++

    // 防止无限循环
    if (counter > 1000) {
      ora({
        text: chalk.red(`错误: ${relativePath} - 无法生成唯一文件名`),
        prefixText: '  '
      }).fail()
      return
    }
  }

  const renameSpinner = ora({
    text: `重命名: ${relativePath}`,
    prefixText: '  '
  }).start()

  try {
    fs.renameSync(filePath, newPath)
    const newRelativePath = path.relative(staticDir, newPath)
    renameSpinner.succeed(chalk.green(`重命名: ${relativePath} ➜ ${newRelativePath}`))
  } catch (error) {
    renameSpinner.fail(chalk.red(`错误: ${relativePath} - ${error.message}`))
  }
}

// 检查是否是图片文件
function isImageFile(filename) {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico']
  const ext = path.extname(filename).toLowerCase()
  return imageExts.includes(ext)
}

// 初始化：递归扫描现有文件
function scanExistingFiles() {
  console.log()
  console.log(chalk.cyan.bold('  🔍 扫描现有图片文件（递归扫描所有子目录）'))
  console.log()

  const scanSpinner = ora({
    text: '正在递归扫描图片文件...',
    prefixText: '  '
  }).start()

  let imageFiles = []

  // 递归扫描目录
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // 递归扫描子目录
        scanDirectory(fullPath)
      } else if (entry.isFile() && isImageFile(entry.name)) {
        imageFiles.push(fullPath)
      }
    }
  }

  scanDirectory(staticDir)

  if (imageFiles.length === 0) {
    scanSpinner.info(chalk.gray('未发现图片文件'))
    console.log()
    return
  }

  scanSpinner.succeed(chalk.green(`发现 ${imageFiles.length} 个图片文件`))
  console.log()

  for (const filePath of imageFiles) {
    renameQueue.add(filePath)
  }
  scheduleProcess()

  console.log()
}

// 启动文件监听
function startWatcher() {
  console.log()
  console.log(chalk.blue.bold('  📂 监听路径: ') + chalk.cyan(staticDir))
  console.log(chalk.blue('  🔄 监听模式: 实时监听（递归监听所有子目录）'))
  console.log(chalk.blue('  📸 命名格式: YYYYMMDDHHMMSS + 毫秒 (如: 20251107114812345.png)'))
  console.log(chalk.gray('               如有冲突会自动添加序号 (如: 20251107114812345_1.png)'))
  console.log()
  console.log(chalk.yellow('  💡 提示: 按 Ctrl+C 停止监听'))
  console.log()

  const patterns = ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.bmp', '**/*.webp', '**/*.svg', '**/*.ico']
  const watcher = chokidar.watch(
    patterns.map(p => path.join(staticDir, p)),
    {
      persistent: true,
      ignoreInitial: true, // 忽略初始扫描
      awaitWriteFinish: {
        stabilityThreshold: 500, // 文件稳定后再处理
        pollInterval: 100
      },
      depth: undefined, // 递归监听所有层级
      ignorePermissionErrors: true
    }
  )

  // 监听新增文件
  watcher.on('add', filePath => {
    const filename = path.basename(filePath)
    const relativePath = path.relative(staticDir, filePath)
    if (isImageFile(filename)) {
      console.log(chalk.cyan(`  新增文件: ${relativePath}`))
      renameQueue.add(filePath)
      scheduleProcess()
    }
  })

  // 监听文件变化（可选）
  watcher.on('change', filePath => {
    const filename = path.basename(filePath)
    const relativePath = path.relative(staticDir, filePath)
    if (isImageFile(filename)) {
      console.log(chalk.blue(`  文件变化: ${relativePath}`))
      // 变化时不重命名，只是通知
    }
  })

  // 监听错误
  watcher.on('error', error => {
    ora({
      text: chalk.red(`监听错误: ${error.message}`),
      prefixText: '  '
    }).fail()
  })

  const readySpinner = ora({
    text: '监听已启动，等待文件变化...',
    prefixText: '  '
  }).succeed()
  console.log()
}

const renameQueue = new Set()
let processing = false
let pendingSchedule = false
function processQueue() {
  if (processing) return
  processing = true
  try {
    const items = Array.from(renameQueue)
    renameQueue.clear()
    for (const fp of items) {
      try {
        renameImageFile(fp)
      } catch (e) {
        console.log(chalk.red(`  重命名失败: ${fp} - ${e.message}`))
      }
    }
  } finally {
    processing = false
  }
}
function scheduleProcess() {
  if (pendingSchedule) return
  pendingSchedule = true
  setTimeout(() => {
    pendingSchedule = false
    processQueue()
  }, 300)
}

// 主函数
function main() {
  console.log()
  console.log(chalk.bgMagenta.white.bold('                                                              '))
  console.log(chalk.bgMagenta.white.bold('  🖼️  图片文件时间戳重命名工具                                '))
  console.log(chalk.bgMagenta.white.bold('                                                              '))
  console.log()

  // 检查目录是否存在
  if (!fs.existsSync(staticDir)) {
    console.log(chalk.red.bold('  ❌ 错误: 指定的路径不存在'))
    console.log(chalk.gray('    ' + staticDir))
    console.log()
    console.log(chalk.yellow.bold('  💡 提示: 请检查路径是否正确'))
    console.log()
    process.exit(1)
  }

  // 检查是否是目录
  const stats = fs.statSync(staticDir)
  if (!stats.isDirectory()) {
    console.log(chalk.red.bold('  ❌ 错误: 指定的路径不是目录'))
    console.log(chalk.gray('    ' + staticDir))
    console.log()
    process.exit(1)
  }

  // 先扫描现有文件
  scanExistingFiles()

  // 启动实时监听
  startWatcher()
}

// 运行
main()
