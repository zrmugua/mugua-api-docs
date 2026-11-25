<script setup>
import { withBase } from 'vitepress'
import EndpointCopy from './EndpointCopy.vue'
const docLink = link => withBase(`${link}.html`)

const paths = [
  { step: '01', title: '发出第一次请求', detail: '创建密钥、查询模型，用 cURL 或 PowerShell 跑通一次调用。', link: '/guide/start', action: '快速开始' },
  { step: '02', title: '连接你的开发工具', detail: '为 Claude Code、Codex、OpenCode 和桌面客户端找到对应配置。', link: '/guide/tools', action: '选择工具' },
  { step: '03', title: '构建自己的应用', detail: '从 SDK 示例到流式输出，按协议查阅参数与响应结构。', link: '/guide/sdk', action: '查看 SDK 示例' }
]
const protocols = [
  { name: 'Chat Completions', path: '/v1/chat/completions', usage: '聊天应用 · OpenAI 兼容客户端', link: '/reference/chat-completions' },
  { name: 'Responses API', path: '/v1/responses', usage: 'Codex · Responses 模式的代理工具', link: '/reference/responses' },
  { name: 'Anthropic Messages', path: '/v1/messages', usage: 'Claude Code · Anthropic SDK', link: '/reference/anthropic-messages' },
  { name: 'Images', path: '/v1/images/generations', usage: 'OpenAI 兼容图片生成', link: '/reference/images' }
]
const tools = [
  ['Claude Code', '/cli/claude-code'], ['Codex', '/cli/codex'],
  ['OpenCode', '/cli/opencode'], ['OpenClaw', '/cli/openclaw'],
  ['Cherry Studio', '/client/cherry-studio'], ['CC Switch', '/cli/cc-switch'],
  ['AIO Coding Hub', '/cli/aio-coding-hub']
]
</script>

<template>
  <div class="home-portal">
    <section aria-labelledby="paths-title">
      <div class="portal-heading"><div><p class="eyebrow">从这里开始</p><h2 id="paths-title">找到适合你的接入方式</h2></div><a :href="docLink('/guide/intro')">了解木瓜 API <span aria-hidden="true">↗</span></a></div>
      <div class="path-grid">
        <a v-for="path in paths" :key="path.step" :href="docLink(path.link)" class="path-card">
          <span class="path-step">{{ path.step }}</span>
          <h3>{{ path.title }}</h3><p>{{ path.detail }}</p>
          <span class="path-action">{{ path.action }} <span aria-hidden="true">→</span></span>
        </a>
      </div>
    </section>

    <section class="endpoint-section" aria-label="接入地址与线路速查">
      <EndpointCopy compact />
    </section>

    <section class="protocol-section" aria-labelledby="protocol-title">
      <div class="portal-heading"><div><p class="eyebrow">接口速览</p><h2 id="protocol-title">按协议接入，按需求选择</h2></div><a :href="docLink('/reference/protocols')">协议对照 <span aria-hidden="true">↗</span></a></div>
      <div class="protocol-list">
        <a v-for="protocol in protocols" :key="protocol.name" :href="docLink(protocol.link)" class="protocol-row">
          <span class="protocol-name">{{ protocol.name }}</span><code><span class="http-method">POST</span> {{ protocol.path }}</code><span class="protocol-usage">{{ protocol.usage }}</span><span aria-hidden="true">↗</span>
        </a>
      </div>
      <p class="protocol-note">可用模型由令牌<a :href="docLink('/guide/groups')">分组</a>决定，具体分组与价格以<a href="https://api.mugua.link" target="_blank" rel="noreferrer">控制台</a>为准。AI 编程工具可直接读取 <a :href="withBase('/llms.txt')">llms.txt</a> 或 <a :href="withBase('/llms-full.txt')">llms-full.txt</a>。</p>
    </section>
    <section class="tools-section" aria-labelledby="tools-title"><h2 id="tools-title">让常用工具准备就绪</h2><div class="tool-links"><a v-for="[name, link] in tools" :key="name" :href="docLink(link)">{{ name }} <span aria-hidden="true">↗</span></a></div></section>
    <div class="help-strip">
      <div>
        <strong>接入遇到问题，或想第一时间获取上新通知？</strong>
        <p>模型上新、抽奖活动与站点通知均在 QQ 群发布；排查报错可先按状态码与路径定位。</p>
      </div>
      <div class="help-actions">
        <a :href="docLink('/guide/troubleshooting')">打开故障排查 <span aria-hidden="true">→</span></a>
        <a href="https://qm.qq.com/q/Q90cLKHh2k" target="_blank" rel="noreferrer" class="help-qq">加入 QQ 用户群</a>
      </div>
    </div>
  </div>
</template>
