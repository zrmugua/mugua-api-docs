<script setup>
import { computed, ref } from 'vue'

defineProps({
  compact: { type: Boolean, default: false }
})

const routes = [
  { id: 'main', label: '主站（推荐）', host: 'https://api.mugua.link', note: '境内境外独立加速' },
  { id: 'cf', label: 'CF 站（备用）', host: 'https://api.668851.xyz', note: 'Cloudflare 全球加速' }
]

const protocols = [
  {
    id: 'openai',
    label: 'OpenAI 兼容',
    suffix: '/v1',
    sample: 'POST /v1/chat/completions · /v1/responses',
    tip: '适用于 OpenAI SDK、Codex、OpenCode、OpenClaw 与图片生成。'
  },
  {
    id: 'anthropic',
    label: 'Claude Code / Anthropic',
    suffix: '',
    sample: 'POST /v1/messages',
    tip: '填站点根地址，工具与 Anthropic 官方 SDK 会自动拼接 /v1/messages。'
  }
]

const routeId = ref('main')
const protocolId = ref('openai')
const copied = ref(false)
let timer = null

const activeRoute = computed(() => routes.find(r => r.id === routeId.value) ?? routes[0])
const activeProtocol = computed(() => protocols.find(p => p.id === protocolId.value) ?? protocols[0])
const baseUrl = computed(() => `${activeRoute.value.host}${activeProtocol.value.suffix}`)

async function copyUrl() {
  const text = baseUrl.value
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const input = document.createElement('textarea')
      input.value = text
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 1800)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="mg-widget" :class="{ 'mg-widget-compact': compact }">
    <div class="mg-widget-head">
      <div>
        <strong class="mg-widget-title">接入地址与线路速查</strong>
        <p class="mg-widget-sub">主站与 CF 站共用账号和令牌，切换线路只需替换域名。</p>
      </div>
    </div>

    <div class="mg-widget-controls">
      <div class="mg-seg-group" role="group" aria-label="选择协议">
        <button
          v-for="item in protocols"
          :key="item.id"
          type="button"
          class="mg-seg-btn"
          :class="{ 'is-active': protocolId === item.id }"
          :aria-pressed="protocolId === item.id"
          @click="protocolId = item.id"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="mg-seg-group" role="group" aria-label="选择线路">
        <button
          v-for="item in routes"
          :key="item.id"
          type="button"
          class="mg-seg-btn"
          :class="{ 'is-active': routeId === item.id }"
          :aria-pressed="routeId === item.id"
          @click="routeId = item.id"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="mg-copy-bar">
      <div class="mg-copy-url">
        <span class="mg-copy-label">Base URL</span>
        <code>{{ baseUrl }}</code>
      </div>
      <button type="button" class="mg-btn-primary" @click="copyUrl">
        {{ copied ? '已复制 ✓' : '复制地址' }}
      </button>
    </div>

    <div class="mg-widget-foot">
      <span>{{ activeProtocol.tip }}</span>
      <span class="mg-widget-meta">{{ activeRoute.note }} · {{ activeProtocol.sample }}</span>
    </div>
  </div>
</template>
