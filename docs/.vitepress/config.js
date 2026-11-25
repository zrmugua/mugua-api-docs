const SITE_URL = 'https://docs.668851.xyz'
const SITE_NAME = '木瓜 API'
const DEFAULT_DESC = '木瓜 API 开发者文档：快速接入、SDK 与开发工具配置、接口参考和故障排查。'

export default {
  lang: 'zh-CN',
  title: SITE_NAME,
  description: DEFAULT_DESC,

  sitemap: {
    hostname: SITE_URL
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#2463d4' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { name: 'twitter:card', content: 'summary' }]
  ],

  transformHead({ pageData }) {
    const routePath = pageData.relativePath
      .replace(/(?:^|\/)index\.md$/, '')
      .replace(/\.md$/, '.html')
    const canonical = routePath ? `${SITE_URL}/${routePath}` : `${SITE_URL}/`
    const pageTitle = pageData.title ? `${pageData.title} | ${SITE_NAME}` : SITE_NAME
    const pageDesc = pageData.description || pageData.frontmatter?.description || DEFAULT_DESC

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDesc }],
      ['meta', { property: 'og:url', content: canonical }]
    ]
  },

  themeConfig: {
    logo: {
      src: '/logo.svg',
      alt: '木瓜 API'
    },

    nav: [
      { text: '指南', link: '/guide/start' },
      { text: '工具接入', link: '/guide/tools' },
      { text: 'API 参考', link: '/reference/protocols' },
      { text: '常见问题', link: '/guide/faq' },
      { text: 'QQ 用户群', link: 'https://qm.qq.com/q/Q90cLKHh2k' },
      { text: '控制台', link: 'https://api.mugua.link' }
    ],

    sidebar: [
      {
        text: '使用指南',
        items: [
          { text: '快速开始', link: '/guide/start' },
          { text: '平台介绍', link: '/guide/intro' },
          { text: '接入地址与协议', link: '/guide/base-url' },
          { text: '分组与令牌', link: '/guide/groups' },
          { text: '鉴权与安全', link: '/guide/auth' },
          { text: 'SDK 配置', link: '/guide/sdk' },
          { text: '额度与计费', link: '/guide/billing' }
        ]
      },
      {
        text: '工具接入',
        items: [{ text: '选择接入方式', link: '/guide/tools' }]
      },
      {
        text: '配置管理工具',
        items: [
          { text: 'CC Switch 统一配置', link: '/cli/cc-switch' },
          { text: 'AIO Coding Hub 配置指南', link: '/cli/aio-coding-hub' }
        ]
      },
      {
        text: '命令行工具',
        items: [
          { text: 'Claude Code 安装配置', link: '/cli/claude-code' },
          { text: 'Codex 安装配置', link: '/cli/codex' },
          { text: 'OpenCode 配置指南', link: '/cli/opencode' },
          { text: 'OpenClaw 配置说明', link: '/cli/openclaw' }
        ]
      },
      {
        text: '客户端配置',
        items: [
          { text: 'Cherry Studio 配置指南', link: '/client/cherry-studio' }
        ]
      },
      {
        text: 'API 参考',
        items: [
          { text: '接口协议对照', link: '/reference/protocols' },
          { text: '模型列表', link: '/reference/models' },
          { text: '聊天补全', link: '/reference/chat-completions' },
          { text: 'Responses API', link: '/reference/responses' },
          { text: 'Anthropic Messages', link: '/reference/anthropic-messages' },
          { text: '图片生成', link: '/reference/images' },
          { text: '流式输出', link: '/reference/streaming' },
          { text: '错误处理', link: '/reference/errors' }
        ]
      },
      {
        text: '帮助',
        items: [
          { text: '常见问题', link: '/guide/faq' },
          { text: '故障排查', link: '/guide/troubleshooting' }
        ]
      }
    ],

    outline: {
      level: [2, 3],
      label: '本页内容'
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '文档目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '切换外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳到正文',
    externalLinkIcon: true,

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清空搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到相关结果',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    },

    footer: {
      message: '木瓜 API · 开发者文档 · <a href="https://qm.qq.com/q/Q90cLKHh2k" target="_blank" rel="noreferrer">QQ 用户群</a> · <a href="/llms.txt">llms.txt</a>',
      copyright: 'Copyright © 2026 木瓜 API'
    }
  }
}
