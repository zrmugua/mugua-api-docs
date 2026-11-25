import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '../docs/.vitepress/config.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = path.join(root, 'docs')
const publicRoot = path.join(docsRoot, 'public')
const siteUrl = (config.sitemap?.hostname || 'https://docs.668851.xyz').replace(/\/+$/, '')
const UTF8_BOM = '\uFEFF'

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: {}, body: source }
  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!kv) continue
    meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return { meta, body: source.slice(match[0].length) }
}

function cleanBodyForLlms(markdown) {
  return markdown
    .replace(/^<(?:EndpointCopy|BillingCalculator|ConfigFill|HomePortal)\b[^>]*\/>\s*$/gm, '')
    .replace(/^:::\s*code-group\s*$/gm, '')
    .replace(/^:::\s*$/gm, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const sidebar = config.themeConfig?.sidebar || []
const indexLines = [
  `# ${config.title || '木瓜 API'}`,
  '',
  `> ${config.description || ''}`,
  '',
  '## 平台关键信息',
  '',
  '- 控制台与主站：https://api.mugua.link',
  '- OpenAI 兼容 Base URL：https://api.mugua.link/v1',
  '- Claude Code / Anthropic Base URL：https://api.mugua.link',
  '- 备用线路（CF 站）：https://api.668851.xyz',
  '- 充值比例：0.5 元人民币 = 1 美元额度（具体模型、分组与倍率以控制台为准）',
  '- 官方 QQ 用户群（上新与通知）：https://qm.qq.com/q/Q90cLKHh2k',
  `- 完整纯文本汇总：${siteUrl}/llms-full.txt`,
  ''
]

const fullParts = [
  `# ${config.title || '木瓜 API'} — 完整文档汇总`,
  '',
  `> 源站：${siteUrl}`,
  '> 控制台与主站：https://api.mugua.link | 备用线路（CF 站）：https://api.668851.xyz',
  '> OpenAI 兼容 Base URL：https://api.mugua.link/v1 | Claude Code / Anthropic Base URL：https://api.mugua.link',
  '> 官方 QQ 用户群：https://qm.qq.com/q/Q90cLKHh2k',
  ''
]

const aiPages = {}
let pageCount = 0

for (const group of sidebar) {
  indexLines.push(`## ${group.text}`, '')
  for (const item of group.items || []) {
    const rel = item.link.replace(/^\/+/, '')
    const mdPath = path.join(docsRoot, `${rel}.md`)
    if (!existsSync(mdPath)) {
      throw new Error(`找不到侧边栏指向的文档文件：${mdPath}`)
    }
    const raw = readFileSync(mdPath, 'utf8')
    const { meta, body } = parseFrontmatter(raw)
    const url = `${siteUrl}/${rel}.html`
    const desc = meta.description ? `：${meta.description}` : ''
    const cleaned = cleanBodyForLlms(body)
    indexLines.push(`- [${item.text}](${url})${desc}`)

    fullParts.push(
      '---',
      '',
      `<!-- Source: ${url} -->`,
      `原文地址：${url}`,
      '',
      cleaned,
      ''
    )

    aiPages[rel] = [
      `原文：${url}`,
      '控制台与主站：https://api.mugua.link | 备用线路（CF 站）：https://api.668851.xyz',
      '',
      cleaned
    ].join('\n')

    pageCount++
  }
  indexLines.push('')
}

const llmsTxt = `${indexLines.join('\n').trim()}\n`
const llmsFullTxt = `${fullParts.join('\n').trim()}\n`

writeFileSync(path.join(publicRoot, 'llms.txt'), UTF8_BOM + llmsTxt, 'utf8')
writeFileSync(path.join(publicRoot, 'llms-full.txt'), UTF8_BOM + llmsFullTxt, 'utf8')
writeFileSync(path.join(publicRoot, 'ai-docs.json'), JSON.stringify(aiPages), 'utf8')

console.log(`已生成 llms.txt（${pageCount} 篇索引）、llms-full.txt（${llmsFullTxt.length} 字符）与 ai-docs.json。`)
