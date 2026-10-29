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
  console.log(`构建产物：${htmlFiles.length} 个 HTML 页面，${links} 个内部链接与资源引用。`)
} else {
  const md = await createMarkdownRenderer(docsRoot)
  const markdownFiles = filesIn(docsRoot, '.md')
  const documents = new Map()
  const parsed = new Map()
  for (const file of markdownFiles) {
    const source = readFileSync(file, 'utf8')
    const env = { relativePath: path.relative(docsRoot, file).replaceAll('\\', '/') }
    documents.set(file, idsIn(md.render(source, env)))
    parsed.set(file, md.parse(source, { ...env }))
    if (source.includes('lastVerified:') && !/^lastVerified: "\d{4}-\d{2}-\d{2}"$/m.test(source)) {
      failures.push(`${path.relative(root, file)}: 核对日期格式应为带引号的 YYYY-MM-DD`)
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
        if (language === 'json') JSON.parse(token.content)
        else if (language === 'toml') parseToml(token.content)
        else if (['js', 'javascript'].includes(language)) {
          const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: token.content, encoding: 'utf8' })
          if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stderr)
        } else if (language === 'powershell' && process.platform === 'win32') {
          const command = '$source = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd())); $tokens = $null; $errors = $null; [System.Management.Automation.Language.Parser]::ParseInput($source, [ref]$tokens, [ref]$errors) | Out-Null; if ($errors.Count) { $errors | ForEach-Object { $_.Message }; exit 1 }'
          const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { input: Buffer.from(token.content, 'utf8').toString('base64'), encoding: 'utf8' })
          if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stdout + result.stderr)
        } else continue
        snippets++
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
  console.log(`文档源码：${markdownFiles.length} 页，${links} 个内部链接，${snippets} 个 JSON / TOML / JavaScript / PowerShell 示例。`)
}

if (failures.length) {
  for (const failure of failures) console.error(failure)
  process.exitCode = 1
} else {
  console.log('检查通过。')
}
