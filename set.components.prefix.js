const fs = require('fs')
const path = require('path')

const newPrefix = process.argv[2]
const dryRun = process.argv.includes('--dry')

if (!newPrefix || typeof newPrefix !== 'string' || !newPrefix.trim()) {
  console.error('用法: node set.components.prefix.js <新前缀> [--dry]')
  process.exit(1)
}

const rootDir = __dirname
const componentsDir = path.join(rootDir, 'components')
const pagesDir = path.join(rootDir, 'pages')
const pagesJsonPath = path.join(rootDir, 'pages.json')

if (!fs.existsSync(componentsDir)) {
  console.error('未找到目录: ' + componentsDir)
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
  console.log('没有可变更的文件')
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
    console.error('pages.json 解析失败')
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
          // 仅在 <template> 块中替换组件标签前缀
          const tplStart = content.indexOf('<template')
          const tplEnd = content.indexOf('</template>')
          if (tplStart !== -1 && tplEnd !== -1 && tplEnd > tplStart) {
            const tplOpenEnd = content.indexOf('>', tplStart)
            const before = content.slice(0, tplOpenEnd + 1)
            const tplInner = content.slice(tplOpenEnd + 1, tplEnd)
            const afterTpl = content.slice(tplEnd)
            const tagRe = new RegExp(`(<\\/?)${escapeRegExp(p)}-([A-Za-z0-9_-]+)`, 'g')
            const newTplInner = tplInner.replace(tagRe, (m, pre, comp) => {
              replaced++
              return `${pre}${newPrefix}-${comp}`
            })
            content = before + newTplInner + afterTpl
          }

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
  console.log('Dry-run 预览变更:')
  for (const c of changes) {
    console.log(`${c.oldName} -> ${c.newName}`)
  }
  if (collision) {
    for (const c of changes) {
      if (fs.existsSync(c.newPath)) {
        console.log(`冲突: 目标已存在 ${c.newName}`)
      }
    }
  }
  if (pagesUpdated) {
    for (const j of jsonChanges) {
      console.log(`pages.json easycom custom: ${j.oldKey} -> ${j.newKey}`)
      console.log(`pages.json easycom custom: ${j.oldVal} -> ${j.newVal}`)
    }
  }
  if (pageFileChanges.length) {
    for (const f of pageFileChanges) {
      console.log(`页面: ${path.relative(rootDir, f.file)} 替换次数: ${f.replaced}`)
    }
  }
  process.exit(0)
}

if (collision) {
  console.error('检测到目标文件已存在的冲突，已终止。请处理冲突后再运行。')
  process.exit(1)
}

for (const c of changes) {
  fs.renameSync(c.oldPath, c.newPath)
  console.log(`${c.oldName} -> ${c.newName}`)
}

if (pagesUpdated && pagesData) {
  fs.writeFileSync(pagesJsonPath, JSON.stringify(pagesData, null, 2) + '\n', 'utf8')
  console.log('已更新 pages.json easycom custom 映射')
}

console.log(`已完成前缀替换为: ${newPrefix}`)
