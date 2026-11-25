import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createMarkdownRenderer } from 'vitepress'
import { parse as parseToml } from 'smol-toml'
import config from '../docs/.vitepress/config.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = path.join(root, 'docs')
const failures = []
let snippets = 0
let links = 0

function filesIn(directory, extension) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.')) return []
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? filesIn(file, extension) : file.endsWith(extension) ? [file] : []
  })
}

function idsIn(html) {
  return new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))
}

function detectPython() {
  for (const cmd of ['python3', 'python', 'py']) {
    const res = spawnSync(cmd, ['-c', 'import ast; print("ok")'], { encoding: 'utf8' })
    if (!res.error && res.status === 0 && res.stdout.trim() === 'ok') return cmd
  }
  return null
}

function checkLink(href, source, documents, built = false) {
  if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) return
  links++
  try {
    const sourceRoute = '/' + path.relative(built ? path.join(docsRoot, '.vitepress/dist') : docsRoot, source).replaceAll('\\', '/')
    const url = new URL(href, 'https://docs.local' + sourceRoute)
    let route = decodeURIComponent(url.pathname)
    if (route.endsWith('/')) route += 'index'
    const extension = path.posix.extname(route)
    const documentRoute = route.replace(/\.(?:md|html)$/, '') + (built ? '.html' : '.md')
    const target = extension && !['.md', '.html'].includes(extension)
      ? path.join(built ? path.join(docsRoot, '.vitepress/dist') : path.join(docsRoot, 'public'), route)
      : path.join(built ? path.join(docsRoot, '.vitepress/dist') : docsRoot, documentRoute)
    if (!existsSync(target)) {
      failures.push(`${path.relative(root, source)}: 目标不存在 ${href}`)
    } else if (url.hash && documents.has(target) && !documents.get(target).has(decodeURIComponent(url.hash.slice(1)))) {
      failures.push(`${path.relative(root, source)}: 锚点不存在 ${href}`)
    }
  } catch (error) {
    failures.push(`${path.relative(root, source)}: 链接格式错误 ${href}: ${error.message}`)
  }
}

function checkBashInlineJson(content) {
  let checked = 0
  // Heredoc JSON: <<EOF ... EOF
  for (const m of content.matchAll(/<<['"]?EOF['"]?[^\n]*\r?\n([\s\S]*?)\r?\nEOF/g)) {
    const body = m[1].trim()
    if (body.startsWith('{') || body.startsWith('[')) {
      const normalized = body.replace(/\$[A-Z0-9_]+/g, 'placeholder')
      JSON.parse(normalized)
      checked++
    }
  }
  // Single-quoted -d '{...}'
  for (const m of content.matchAll(/-d\s+'([\s\S]*?)'/g)) {
    const body = m[1].trim()
    if (body.startsWith('{') || body.startsWith('[')) {
      JSON.parse(body)
      checked++
    }
  }
  return checked
}

const forbiddenPatterns = [
  { regex: /api-fast\.668851\.xyz/i, label: '已废弃线路 api-fast.668851.xyz' },
  { regex: /<MODEL_ID>|<API_KEY>|YOUR_API_KEY/, label: '旧占位符（请统一使用 your-api-key / your-model-id）' },
  { regex: /\b(?:cubence|micu|blackai)\b/i, label: '第三方中转站迁移残留词' }
]

if (process.argv.includes('--built')) {
  const dist = path.join(docsRoot, '.vitepress/dist')
  if (!existsSync(dist)) throw new Error('请先运行 npm run docs:build')
  const htmlFiles = filesIn(dist, '.html')
  const html = new Map(htmlFiles.map(file => [file, readFileSync(file, 'utf8')]))
  const documents = new Map([...html].map(([file, content]) => [file, idsIn(content)]))
  for (const [file, content] of html) {
    for (const match of content.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      checkLink(match[1].replaceAll('&amp;', '&'), file, documents, true)
    }
  }
  for (const requiredAsset of ['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt']) {
    const assetPath = path.join(dist, requiredAsset)
    if (!existsSync(assetPath)) {
      failures.push(`构建产物缺少必要文件：${requiredAsset}`)
    }
  }
  const sitemapPath = path.join(dist, 'sitemap.xml')
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, 'utf8')
    const expectedHost = (config.sitemap?.hostname || 'https://docs.668851.xyz').replace(/\/+$/, '')
    if (!sitemap.includes(`${expectedHost}/`)) {
      failures.push(`sitemap.xml 未包含预期域名 ${expectedHost}`)
    }
  }
  console.log(`构建产物：${htmlFiles.length} 个 HTML 页面，${links} 个内部链接与资源引用，已校验 sitemap / robots / llms。`)
} else {
  const md = await createMarkdownRenderer(docsRoot)
  const markdownFiles = filesIn(docsRoot, '.md')
  const documents = new Map()
  const parsed = new Map()
  const pythonCmd = detectPython()

  for (const file of markdownFiles) {
    const source = readFileSync(file, 'utf8')
    const relPath = path.relative(root, file)
    const env = { relativePath: path.relative(docsRoot, file).replaceAll('\\', '/') }
    documents.set(file, idsIn(md.render(source, env)))
    parsed.set(file, md.parse(source, { ...env }))

    const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fm || !/^description:\s*.+$/m.test(fm[1])) {
      failures.push(`${relPath}: 缺少 frontmatter description（用于 SEO 摘要）`)
    }
    if (source.includes('lastVerified:') && !/^lastVerified: "\d{4}-\d{2}-\d{2}"$/m.test(source)) {
      failures.push(`${relPath}: 核对日期格式应为带引号的 YYYY-MM-DD`)
    }
    for (const { regex, label } of forbiddenPatterns) {
      if (regex.test(source)) {
        failures.push(`${relPath}: 命中禁用内容「${label}」`)
      }
    }
  }

  for (const [file, tokens] of parsed) {
    for (const token of tokens) {
      for (const child of token.children ?? []) {
        if (child.type === 'link_open') checkLink(child.attrGet('href'), file, documents)
        if (child.type === 'image') checkLink(child.attrGet('src'), file, documents)
      }
      if (token.type !== 'fence') continue
      const language = token.info.split(/[\s\[]/)[0]
      const line = (token.map?.[0] ?? 0) + 1
      try {
        if (language === 'json') {
          JSON.parse(token.content)
          snippets++
        } else if (language === 'toml') {
          parseToml(token.content)
          snippets++
        } else if (['js', 'javascript'].includes(language)) {
          const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: token.content, encoding: 'utf8' })
          if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stderr)
          snippets++
        } else if (language === 'powershell' && process.platform === 'win32') {
          const command = '$source = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd())); $tokens = $null; $errors = $null; [System.Management.Automation.Language.Parser]::ParseInput($source, [ref]$tokens, [ref]$errors) | Out-Null; if ($errors.Count) { $errors | ForEach-Object { $_.Message }; exit 1 }'
          const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { input: Buffer.from(token.content, 'utf8').toString('base64'), encoding: 'utf8' })
          if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stdout + result.stderr)
          snippets++
        } else if (language === 'python' && pythonCmd) {
          const result = spawnSync(pythonCmd, ['-c', 'import ast, sys; ast.parse(sys.stdin.read())'], { input: token.content, encoding: 'utf8' })
          if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stderr)
          snippets++
        } else if (['bash', 'sh'].includes(language)) {
          const n = checkBashInlineJson(token.content)
          snippets += n
        }
      } catch (error) {
        failures.push(`${path.relative(root, file)}:${line}: ${language} 示例格式错误：${error.message}`)
      }
    }
  }

  function checkNavigation(value) {
    if (!value || typeof value !== 'object') return
    if (typeof value.link === 'string') checkLink(value.link, path.join(docsRoot, 'index.md'), documents)
    for (const child of Object.values(value)) checkNavigation(child)
  }
  checkNavigation(config.themeConfig)

  for (const file of filesIn(path.join(docsRoot, 'public'), '.json')) {
    try { JSON.parse(readFileSync(file, 'utf8')) }
    catch (error) { failures.push(`${path.relative(root, file)}: JSON 格式错误：${error.message}`) }
  }

  const pyNote = pythonCmd ? ' / Python' : ''
  console.log(`文档源码：${markdownFiles.length} 页，${links} 个内部链接，${snippets} 个 JSON / TOML / JavaScript / PowerShell / Bash JSON${pyNote} 示例。`)
}

if (failures.length) {
  for (const failure of failures) console.error(failure)
  process.exitCode = 1
} else {
  console.log('检查通过。')
}
