const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')

const newPrefix = process.argv[2]
const dryRun = process.argv.includes('--dry')

if (!newPrefix || typeof newPrefix !== 'string' || !newPrefix.trim()) {
  console.log()
  console.log(chalk.red.bold('  ❌ 错误: 缺少前缀参数'))
  console.log()
  console.log(chalk.cyan.bold('  📖 用法:'))
  console.log(chalk.gray('    node set.components.prefix.js <新前缀> [--dry]'))
  console.log()
  console.log(chalk.cyan.bold('  📚 示例:'))
  console.log(chalk.green('    node set.components.prefix.js my-component'))
  console.log(chalk.yellow('    node set.components.prefix.js new-prefix --dry') + chalk.gray('  (预览模式)'))
  console.log()
  process.exit(1)
}

const rootDir = __dirname
const componentsDir = path.join(rootDir, 'components')
const pagesDir = path.join(rootDir, 'pages')
const pagesJsonPath = path.join(rootDir, 'pages.json')

if (!fs.existsSync(componentsDir)) {
  console.log()
  console.log(chalk.red.bold('  ❌ 错误: 未找到目录'))
  console.log(chalk.gray('    ' + componentsDir))
  console.log()
  process.exit(1)
}

const entries = fs.readdirSync(componentsDir, { withFileTypes: true })
const changes = []
const jsonChanges = []
const oldPrefixes = new Set()

for (const entry of entries) {
  if (!entry.isFile()) continue
  const name = entry.name
  const hyphenIndex = name.indexOf('-')
  if (hyphenIndex <= 0) continue
  oldPrefixes.add(name.substring(0, hyphenIndex))
  const after = name.substring(hyphenIndex)
  const newName = `${newPrefix}${after}`
  if (newName === name) continue
  const oldPath = path.join(componentsDir, name)
  const newPath = path.join(componentsDir, newName)
  changes.push({ oldPath, newPath, oldName: name, newName })
}

if (changes.length === 0) {
  console.log()
  console.log(chalk.green('  ✨ 没有需要变更的文件'))
  console.log()
  process.exit(0)
}

let collision = false
for (const c of changes) {
  if (fs.existsSync(c.newPath)) {
    collision = true
  }
}

let pagesData = null
let pagesUpdated = false
if (fs.existsSync(pagesJsonPath)) {
  try {
    const raw = fs.readFileSync(pagesJsonPath, 'utf8')
    pagesData = JSON.parse(raw)
  } catch (e) {
    console.log()
    console.log(chalk.red.bold('  ❌ 错误: pages.json 解析失败'))
    console.log(chalk.gray('    ' + e.message))
    console.log()
    process.exit(1)
  }
  if (pagesData && pagesData.easycom && pagesData.easycom.custom && typeof pagesData.easycom.custom === 'object') {
    const newCustom = {}
    for (const [k, v] of Object.entries(pagesData.easycom.custom)) {
      let nk = k
      let nv = v
      for (const p of oldPrefixes) {
        if (typeof k === 'string' && k.startsWith('^') && k.includes('-(.*)') && k.startsWith(`^${p}-`)) {
          nk = `^${newPrefix}-(.*)`
        }
        if (
          typeof v === 'string' &&
          v.startsWith('@/components/') &&
          v.includes('-$1.vue') &&
          v.startsWith(`@/components/${p}-`)
        ) {
          nv = `@/components/${newPrefix}-$1.vue`
        }
      }
      if (nk !== k || nv !== v) {
        pagesUpdated = true
        jsonChanges.push({ oldKey: k, newKey: nk, oldVal: v, newVal: nv })
      }
      newCustom[nk] = nv
    }
    pagesData.easycom.custom = newCustom
  }
}

// 递归遍历 pages 目录并替换页面中使用的组件标签与引用
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const pageFileChanges = []
if (fs.existsSync(pagesDir)) {
  const stack = [pagesDir]
  while (stack.length) {
    const dir = stack.pop()
    const items = fs.readdirSync(dir, { withFileTypes: true })
    for (const it of items) {
      const full = path.join(dir, it.name)
      if (it.isDirectory()) {
        stack.push(full)
      } else if (it.isFile() && full.endsWith('.vue')) {
        let content = fs.readFileSync(full, 'utf8')
        let replaced = 0
        for (const p of oldPrefixes) {
          // 替换所有组件标签（开始标签、结束标签、自闭合标签）
          // 匹配: <tasi-xxx、</tasi-xxx、<tasi-xxx/>
          const tagRe = new RegExp(`<(\\/?)${escapeRegExp(p)}-([A-Za-z0-9_-]+)`, 'g')
          content = content.replace(tagRe, (m, slash, comp) => {
            replaced++
            return `<${slash}${newPrefix}-${comp}`
          })

          // 在整个文件中更新 import 路径（脚本部分通常）
          const importRe = new RegExp(`@\\/components\\/${escapeRegExp(p)}-([A-Za-z0-9_-]+)\\.vue`, 'g')
          content = content.replace(importRe, (m, comp) => {
            replaced++
            return `@/components/${newPrefix}-${comp}.vue`
          })

          // 在字符串字面量中出现的组件名也替换（例如注册组件名）
          const strNameRe = new RegExp(`([\"\'\`])${escapeRegExp(p)}-([A-Za-z0-9_-]+)\\1`, 'g')
          content = content.replace(strNameRe, (m, q, comp) => {
            replaced++
            return `${q}${newPrefix}-${comp}${q}`
          })
        }
        if (replaced > 0) {
          pageFileChanges.push({ file: full, replaced })
          if (!dryRun) {
            fs.writeFileSync(full, content, 'utf8')
          }
        }
      }
    }
  }
}

if (dryRun) {
  console.log()
  console.log(chalk.bgCyan.black.bold('                                                              '))
  console.log(chalk.bgCyan.black.bold('  🔍 预览模式 - 以下是将要执行的变更                          '))
  console.log(chalk.bgCyan.black.bold('                                                              '))
  console.log()

  if (changes.length > 0) {
    console.log(chalk.blue.bold('  📁 组件文件重命名') + chalk.gray(` (${changes.length} 个)`))
    console.log(chalk.gray('  ' + '─'.repeat(58)))
    for (const c of changes) {
      console.log('    ' + chalk.red(c.oldName) + chalk.yellow(' ➜ ') + chalk.green(c.newName))
    }
    console.log()
  }

  if (collision) {
    console.log(chalk.yellow.bold('  ⚠️  文件冲突警告'))
    console.log(chalk.gray('  ' + '─'.repeat(58)))
    for (const c of changes) {
      if (fs.existsSync(c.newPath)) {
        console.log('    ' + chalk.red('❌ 目标文件已存在: ') + chalk.yellow(c.newName))
      }
    }
    console.log()
  }

  if (pagesUpdated) {
    console.log(chalk.magenta.bold('  📝 pages.json 配置更新'))
    console.log(chalk.gray('  ' + '─'.repeat(58)))
    for (const j of jsonChanges) {
      console.log(chalk.gray('    easycom.custom:'))
      console.log('      ' + chalk.red(j.oldKey) + chalk.yellow(' ➜ ') + chalk.green(j.newKey))
      console.log('      ' + chalk.red(j.oldVal) + chalk.yellow(' ➜ ') + chalk.green(j.newVal))
    }
    console.log()
  }

  if (pageFileChanges.length > 0) {
    console.log(chalk.cyan.bold('  📄 页面文件内容替换') + chalk.gray(` (${pageFileChanges.length} 个)`))
    console.log(chalk.gray('  ' + '─'.repeat(58)))
    for (const f of pageFileChanges) {
      const relativePath = path.relative(rootDir, f.file)
      console.log('    ' + chalk.cyan(relativePath) + chalk.gray(` (${f.replaced} 处替换)`))
    }
    console.log()
  }

  console.log(chalk.gray('  ' + '═'.repeat(58)))
  console.log(chalk.yellow.bold('  💡 提示: ') + chalk.white('移除 --dry 参数以执行实际变更'))
  console.log(chalk.gray('  ' + '═'.repeat(58)))
  console.log()
  process.exit(0)
}

if (collision) {
  console.log()
  console.log(chalk.bgRed.white.bold('                                                              '))
  console.log(chalk.bgRed.white.bold('  ❌ 检测到文件冲突                                            '))
  console.log(chalk.bgRed.white.bold('                                                              '))
  console.log()
  for (const c of changes) {
    if (fs.existsSync(c.newPath)) {
      console.log('    ' + chalk.red('❌ 目标文件已存在: ') + chalk.yellow(c.newName))
    }
  }
  console.log()
  console.log(chalk.yellow.bold('  💡 请先处理冲突后再运行'))
  console.log()
  process.exit(1)
}

console.log()
const mainSpinner = ora({
  text: chalk.cyan.bold('准备执行组件前缀替换...'),
  color: 'cyan'
}).start()

setTimeout(() => {
  mainSpinner.succeed(chalk.green.bold('开始执行组件前缀替换'))
  console.log()
  console.log(chalk.bgMagenta.white.bold('                                                              '))
  console.log(chalk.bgMagenta.white.bold('  🚀 组件前缀替换                                             '))
  console.log(chalk.bgMagenta.white.bold('                                                              '))
  console.log()

  if (changes.length > 0) {
    const renameSpinner = ora(chalk.blue('重命名组件文件...')).start()
    console.log()
    for (const c of changes) {
      fs.renameSync(c.oldPath, c.newPath)
      console.log('    ' + chalk.green('✓ ') + chalk.gray(c.oldName) + chalk.yellow(' ➜ ') + chalk.cyan(c.newName))
    }
    console.log()
    renameSpinner.succeed(chalk.green.bold(`✓ 已重命名 ${changes.length} 个文件`))
    console.log()
  }

  if (pagesUpdated && pagesData) {
    const jsonSpinner = ora(chalk.magenta('更新 pages.json 配置...')).start()
    console.log()
    fs.writeFileSync(pagesJsonPath, JSON.stringify(pagesData, null, 2) + '\n', 'utf8')
    for (const j of jsonChanges) {
      console.log('    ' + chalk.green('✓ ') + chalk.gray(j.oldKey) + chalk.yellow(' ➜ ') + chalk.cyan(j.newKey))
    }
    console.log()
    jsonSpinner.succeed(chalk.green.bold('✓ 已更新 pages.json 配置'))
    console.log()
  }

  if (pageFileChanges.length > 0) {
    const pageSpinner = ora(chalk.cyan('更新页面文件引用...')).start()
    console.log()
    for (const f of pageFileChanges) {
      const relativePath = path.relative(rootDir, f.file)
      console.log('    ' + chalk.green('✓ ') + chalk.cyan(relativePath) + chalk.gray(` (${f.replaced} 处)`))
    }
    console.log()
    pageSpinner.succeed(chalk.green.bold(`✓ 已更新 ${pageFileChanges.length} 个页面文件`))
    console.log()
  }

  console.log(chalk.gray('  ' + '═'.repeat(58)))
  console.log()
  const oldPrefixList = oldPrefixes.size > 0 ? Array.from(oldPrefixes).join(', ') : '无'
  console.log('  ' + chalk.green.bold('✨ 前缀替换完成! '))
  console.log(
    '  ' +
      chalk.gray('原前缀: ') +
      chalk.red(oldPrefixList) +
      chalk.yellow(' ➜ ') +
      chalk.gray('新前缀: ') +
      chalk.green.bold(newPrefix)
  )
  console.log()
  console.log(chalk.gray('  ' + '═'.repeat(58)))
  console.log()
}, 500)
