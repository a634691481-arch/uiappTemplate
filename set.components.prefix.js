const fs = require('fs')
const path = require('path')

const newPrefix = process.argv[2]
const dryRun = process.argv.includes('--dry')

if (!newPrefix || typeof newPrefix !== 'string' || !newPrefix.trim()) {
  console.error('\n❌ 错误: 缺少前缀参数')
  console.log('\n📖 用法: node set.components.prefix.js <新前缀> [--dry]')
  console.log('\n示例:')
  console.log('  node set.components.prefix.js my-component')
  console.log('  node set.components.prefix.js new-prefix --dry  (预览模式)\n')
  process.exit(1)
}

const rootDir = __dirname
const componentsDir = path.join(rootDir, 'components')
const pagesDir = path.join(rootDir, 'pages')
const pagesJsonPath = path.join(rootDir, 'pages.json')

if (!fs.existsSync(componentsDir)) {
  console.error('\n❌ 错误: 未找到目录 ' + componentsDir + '\n')
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
  console.log('\n✨ 没有需要变更的文件\n')
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
    console.error('\n❌ 错误: pages.json 解析失败')
    console.error(e.message + '\n')
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
  console.log('\n' + '='.repeat(60))
  console.log('🔍 预览模式 - 以下是将要执行的变更')
  console.log('='.repeat(60) + '\n')

  if (changes.length > 0) {
    console.log('📁 组件文件重命名 (' + changes.length + ' 个):')
    console.log('-'.repeat(60))
    for (const c of changes) {
      console.log(`  ${c.oldName} ➜ ${c.newName}`)
    }
    console.log()
  }

  if (collision) {
    console.log('⚠️  文件冲突警告:')
    console.log('-'.repeat(60))
    for (const c of changes) {
      if (fs.existsSync(c.newPath)) {
        console.log(`  ❌ 目标文件已存在: ${c.newName}`)
      }
    }
    console.log()
  }

  if (pagesUpdated) {
    console.log('📝 pages.json 配置更新:')
    console.log('-'.repeat(60))
    for (const j of jsonChanges) {
      console.log(`  easycom.custom:`)
      console.log(`    ${j.oldKey} ➜ ${j.newKey}`)
      console.log(`    ${j.oldVal} ➜ ${j.newVal}`)
    }
    console.log()
  }

  if (pageFileChanges.length > 0) {
    console.log('📄 页面文件内容替换 (' + pageFileChanges.length + ' 个):')
    console.log('-'.repeat(60))
    for (const f of pageFileChanges) {
      const relativePath = path.relative(rootDir, f.file)
      console.log(`  ${relativePath} (${f.replaced} 处替换)`)
    }
    console.log()
  }

  console.log('='.repeat(60))
  console.log('💡 提示: 移除 --dry 参数以执行实际变更')
  console.log('='.repeat(60) + '\n')
  process.exit(0)
}

if (collision) {
  console.error('\n' + '='.repeat(60))
  console.error('❌ 检测到文件冲突')
  console.error('='.repeat(60))
  for (const c of changes) {
    if (fs.existsSync(c.newPath)) {
      console.error(`  目标文件已存在: ${c.newName}`)
    }
  }
  console.error('\n💡 请先处理冲突后再运行\n')
  process.exit(1)
}

console.log('\n' + '='.repeat(60))
console.log('🚀 开始执行组件前缀替换')
console.log('='.repeat(60) + '\n')

if (changes.length > 0) {
  console.log('📁 重命名组件文件...')
  console.log('-'.repeat(60))
  for (const c of changes) {
    fs.renameSync(c.oldPath, c.newPath)
    console.log(`  ✓ ${c.oldName} ➜ ${c.newName}`)
  }
  console.log(`\n  共重命名 ${changes.length} 个文件\n`)
}

if (pagesUpdated && pagesData) {
  console.log('📝 更新 pages.json 配置...')
  console.log('-'.repeat(60))
  fs.writeFileSync(pagesJsonPath, JSON.stringify(pagesData, null, 2) + '\n', 'utf8')
  for (const j of jsonChanges) {
    console.log(`  ✓ ${j.oldKey} ➜ ${j.newKey}`)
  }
  console.log()
}

if (pageFileChanges.length > 0) {
  console.log('📄 更新页面文件引用...')
  console.log('-'.repeat(60))
  for (const f of pageFileChanges) {
    const relativePath = path.relative(rootDir, f.file)
    console.log(`  ✓ ${relativePath} (${f.replaced} 处)`)
  }
  console.log(`\n  共更新 ${pageFileChanges.length} 个文件\n`)
}

console.log('='.repeat(60))
console.log(`✨ 前缀替换完成: ${oldPrefixes.size > 0 ? Array.from(oldPrefixes).join(', ') : '无'} ➜ ${newPrefix}`)
console.log('='.repeat(60) + '\n')
