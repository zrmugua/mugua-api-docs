import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '../docs/.vitepress/config.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const statusUrl = 'https://api.mugua.link/api/status'

const issues = []
const notes = []

let payload
try {
  const res = await fetch(statusUrl, { signal: AbortSignal.timeout(10_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  payload = await res.json()
} catch (error) {
  console.error(`无法拉取线上配置 ${statusUrl}：${error.message}`)
  process.exit(1)
}

const data = payload?.data
if (!data) {
  console.error('线上返回缺少 data 字段。')
  process.exit(1)
}

// 1. 核对线路
const baseUrlDoc = readFileSync(path.join(root, 'docs/guide/base-url.md'), 'utf8')
const liveRoutes = (data.api_info || []).map(item => ({
  name: item.route,
  url: String(item.url || '').replace(/\/+$/, '')
}))
for (const route of liveRoutes) {
  if (route.url && !baseUrlDoc.includes(route.url)) {
    issues.push(`线上线路「${route.name}」(${route.url}) 未出现在 docs/guide/base-url.md 中`)
  }
}
notes.push(`线上线路（${liveRoutes.length} 条）：${liveRoutes.map(r => `${r.name} ${r.url}`).join(' | ')}`)

// 2. 核对文档站域名
const liveDocsLink = String(data.docs_link || '').replace(/\/+$/, '')
const cfgHostname = String(config.sitemap?.hostname || '').replace(/\/+$/, '')
if (liveDocsLink && cfgHostname && liveDocsLink !== cfgHostname) {
  issues.push(`线上 docs_link (${liveDocsLink}) 与 sitemap.hostname (${cfgHostname}) 不一致`)
} else {
  notes.push(`文档域名一致：${cfgHostname}`)
}

// 3. 核对充值比例
const billingDoc = readFileSync(path.join(root, 'docs/guide/billing.md'), 'utf8')
if (typeof data.price === 'number') {
  const expected = `${data.price} 元人民币 = 1 美元额度`
  if (!billingDoc.includes(expected)) {
    issues.push(`线上充值比例为 ${data.price} 元 = 1 美元，但 docs/guide/billing.md 未匹配「${expected}」`)
  } else {
    notes.push(`充值比例一致：${expected}`)
  }
}

// 4. 核对 QQ 群链接
const qqMatches = new Set()
for (const ann of data.announcements || []) {
  for (const m of String(ann.content || '').matchAll(/https:\/\/qm\.qq\.com\/q\/[A-Za-z0-9]+/g)) {
    qqMatches.add(m[0])
  }
  for (const m of String(ann.extra || '').matchAll(/https:\/\/qm\.qq\.com\/q\/[A-Za-z0-9]+/g)) {
    qqMatches.add(m[0])
  }
}
const configSource = readFileSync(path.join(root, 'docs/.vitepress/config.js'), 'utf8')
for (const qqUrl of qqMatches) {
  if (!configSource.includes(qqUrl)) {
    issues.push(`线上公告 QQ 群链接 ${qqUrl} 未出现在 docs/.vitepress/config.js 中`)
  }
}
if (qqMatches.size) notes.push(`QQ 群链接一致：${[...qqMatches].join(', ')}`)

for (const n of notes) console.log(`✓ ${n}`)

if (issues.length) {
  console.error('\n发现线上配置与文档不一致：')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exitCode = 1
} else {
  console.log('\n线上配置核对通过。')
}
