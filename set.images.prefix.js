// 监听 static 文件夹下所有的图片，将非时间戳命名的图片重命名为时间戳格式
// 功能：实时监听 static 目录，自动重命名新增或修改的图片文件

const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const ora = require('ora')

const staticDir = path.join(__dirname, 'static')

// 检查是否已经是日期时间格式命名（YYYYMMDDHHMMSS，14位数字）
function isTimestampName(filename) {
  const nameWithoutExt = path.parse(filename).name
  // 匹配 20251107114812 这种格式（14位数字）
  return /^\d{14}$/.test(nameWithoutExt)
}

// 生成日期时间格式文件名（YYYYMMDDHHMMSS）
function generateTimestampName(originalPath) {
  const ext = path.extname(originalPath)
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`
  return `${timestamp}${ext}`
}

// 重命名图片文件
function renameImageFile(filePath) {
  const filename = path.basename(filePath)
  const dir = path.dirname(filePath)

  // 如果已经是日期时间格式命名，跳过
  if (isTimestampName(filename)) {
    const skipSpinner = ora({
      text: chalk.gray(`跳过: ${filename} (已是日期时间格式命名)`),
      prefixText: '  '
    }).info()
    return
  }

  const newName = generateTimestampName(filePath)
  const newPath = path.join(dir, newName)

  // 检查新文件名是否已存在
  if (fs.existsSync(newPath)) {
    const conflictSpinner = ora({
      text: chalk.yellow(`冲突: ${newName} 已存在，延迟1秒重试`),
      prefixText: '  '
    }).warn()
    // 延迟1秒后重新生成时间戳（确保秒数不同）
    setTimeout(() => renameImageFile(filePath), 1000)
    return
  }

  const renameSpinner = ora({
    text: `重命名: ${filename}`,
    prefixText: '  '
  }).start()

  try {
    fs.renameSync(filePath, newPath)
    renameSpinner.succeed(chalk.green(`重命名: ${filename} ➜ ${newName}`))
  } catch (error) {
    renameSpinner.fail(chalk.red(`错误: ${filename} - ${error.message}`))
  }
}

// 检查是否是图片文件
function isImageFile(filename) {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico']
  const ext = path.extname(filename).toLowerCase()
  return imageExts.includes(ext)
}

// 初始化：扫描现有文件
function scanExistingFiles() {
  console.log()
  console.log(chalk.cyan('================================================================'))
  console.log(chalk.cyan.bold('  🔍 扫描现有图片文件'))
  console.log(chalk.cyan('================================================================'))
  console.log()

  if (!fs.existsSync(staticDir)) {
    const createSpinner = ora({
      text: 'static 目录不存在，创建中...',
      prefixText: '  '
    }).start()
    fs.mkdirSync(staticDir, { recursive: true })
    createSpinner.succeed(chalk.green('已创建 static 目录'))
    console.log()
    return
  }

  const scanSpinner = ora({
    text: '正在扫描图片文件...',
    prefixText: '  '
  }).start()

  const files = fs.readdirSync(staticDir)
  const imageFiles = files.filter(isImageFile)

  if (imageFiles.length === 0) {
    scanSpinner.info(chalk.gray('未发现图片文件'))
    console.log()
    return
  }

  scanSpinner.succeed(chalk.green(`发现 ${imageFiles.length} 个图片文件`))
  console.log()

  for (const file of imageFiles) {
    const filePath = path.join(staticDir, file)
    renameImageFile(filePath)
  }

  console.log()
}

// 启动文件监听
function startWatcher() {
  console.log(chalk.cyan('================================================================'))
  console.log(chalk.cyan.bold('  👀 开始监听 static 目录'))
  console.log(chalk.cyan('================================================================'))
  console.log()
  console.log(chalk.blue(`  📂 监听路径: ${staticDir}`))
  console.log(chalk.blue('  🔄 监听模式: 实时监听'))
  console.log(chalk.blue('  📸 命名格式: YYYYMMDDHHMMSS (如: 20251107114812.png)'))
  console.log()
  console.log(chalk.yellow('  💡 提示: 按 Ctrl+C 停止监听'))
  console.log(chalk.cyan('================================================================'))
  console.log()

  const watcher = chokidar.watch(staticDir, {
    persistent: true,
    ignoreInitial: true, // 忽略初始扫描
    awaitWriteFinish: {
      stabilityThreshold: 500, // 文件稳定后再处理
      pollInterval: 100
    }
  })

  // 监听新增文件
  watcher.on('add', filePath => {
    const filename = path.basename(filePath)
    if (isImageFile(filename)) {
      ora({
        text: chalk.cyan(`新增文件: ${filename}`),
        prefixText: '  '
      }).info()
      renameImageFile(filePath)
    }
  })

  // 监听文件变化（可选）
  watcher.on('change', filePath => {
    const filename = path.basename(filePath)
    if (isImageFile(filename)) {
      ora({
        text: chalk.blue(`文件变化: ${filename}`),
        prefixText: '  '
      }).info()
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

// 主函数
function main() {
  console.log()
  console.log(chalk.cyan.bold('================================================================'))
  console.log(chalk.cyan.bold('  🖼️  图片文件时间戳重命名工具'))
  console.log(chalk.cyan.bold('================================================================'))
  console.log()

  // 先扫描现有文件
  scanExistingFiles()

  // 启动实时监听
  startWatcher()
}

// 运行
main()
