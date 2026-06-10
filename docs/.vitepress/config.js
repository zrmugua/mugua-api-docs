export default {
  title: '木瓜 API',
  description: '木瓜 API 使用文档',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#36c9ee' }]
  ],

  themeConfig: {
    logo: {
      src: '/logo.svg',
      alt: '木瓜 API'
    },

    nav: [
      { text: '指南', link: '/guide/start' },
      { text: 'CLI 工具', link: '/cli/cc-switch' },
      { text: '客户端', link: '/client/cherry-studio' },
      { text: 'API 参考', link: '/reference/models' },
      { text: '常见问题', link: '/guide/faq' },
      { text: '控制台', link: 'https://api.mugua.link' }
    ],

    sidebar: [
      {
        text: '使用指南',
        items: [
          { text: '平台介绍', link: '/guide/intro' },
          { text: '接入地址', link: '/guide/base-url' },
          { text: '快速开始', link: '/guide/start' },
          { text: '鉴权与安全', link: '/guide/auth' },
          { text: 'SDK 配置', link: '/guide/sdk' },
          { text: '额度与计费', link: '/guide/billing' }
        ]
      },
      {
        text: 'CLI 工具配置',
        items: [
          { text: 'CC Switch 统一配置', link: '/cli/cc-switch' },
          { text: 'Claude Code 安装配置', link: '/cli/claude-code' },
          { text: 'Codex 安装配置', link: '/cli/codex' },
          { text: 'AIO Coding Hub 配置指南', link: '/cli/aio-coding-hub' },
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
          { text: '模型列表', link: '/reference/models' },
          { text: '聊天补全', link: '/reference/chat-completions' },
          { text: '错误处理', link: '/reference/errors' }
        ]
      },
      {
        text: '帮助',
        items: [
          { text: '常见问题', link: '/guide/faq' }
        ]
      }
    ],

    outline: [2, 3],

    search: {
      provider: 'local'
    },

    footer: {
      message: '木瓜 API 使用文档',
      copyright: 'Copyright © 2026 木瓜 API'
    }
  }
}
