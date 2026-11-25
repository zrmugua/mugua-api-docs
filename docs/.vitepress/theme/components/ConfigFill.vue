<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  tool: {
    type: String,
    required: true,
    validator: v => ['claude-code', 'codex', 'opencode', 'openclaw'].includes(v)
  }
})

const routes = [
  { id: 'main', label: '主站', host: 'https://api.mugua.link' },
  { id: 'cf', label: 'CF 站', host: 'https://api.668851.xyz' }
]

const opencodePkgs = [
  { id: '@ai-sdk/openai-compatible', label: 'Chat Completions' },
  { id: '@ai-sdk/openai', label: 'Responses' },
  { id: '@ai-sdk/anthropic', label: 'Anthropic Messages' }
]

const openclawApis = [
  { id: 'openai-responses', label: 'Responses' },
  { id: 'openai-completions', label: 'Chat Completions' }
]

const routeId = ref('main')
const modelInput = ref('')
const tokenInput = ref('')
const showToken = ref(false)
const opencodePkg = ref('@ai-sdk/openai-compatible')
const openclawApi = ref('openai-responses')
const copied = ref(false)
let timer = null

const host = computed(() => (routes.find(r => r.id === routeId.value) ?? routes[0]).host)
const model = computed(() => modelInput.value.trim() || 'your-model-id')
const token = computed(() => tokenInput.value.trim() || 'your-api-key')

const fileHint = computed(() => {
  switch (props.tool) {
    case 'claude-code': return '~/.claude/settings.json（Windows: %USERPROFILE%\\.claude\\settings.json）'
    case 'codex': return '~/.codex/config.toml（Windows: %USERPROFILE%\\.codex\\config.toml）'
    case 'opencode': return '~/.config/opencode/opencode.json（Windows: %USERPROFILE%\\.config\\opencode\\opencode.json）'
    case 'openclaw': return '~/.openclaw/openclaw.json（Windows: %USERPROFILE%\\.openclaw\\openclaw.json）'
    default: return ''
  }
})

const supportsDirectToken = computed(() => props.tool === 'claude-code')

const generated = computed(() => {
  const m = model.value
  const t = token.value
  const h = host.value

  if (props.tool === 'claude-code') {
    return JSON.stringify({
      env: {
        ANTHROPIC_BASE_URL: h,
        ANTHROPIC_AUTH_TOKEN: t,
        ANTHROPIC_DEFAULT_OPUS_MODEL: m,
        ANTHROPIC_DEFAULT_SONNET_MODEL: m,
        ANTHROPIC_DEFAULT_HAIKU_MODEL: m
      }
    }, null, 2)
  }

  if (props.tool === 'codex') {
    return [
      'model_provider = "mugua"',
      `model = ${JSON.stringify(m)}`,
      '',
      '[model_providers.mugua]',
      'name = "木瓜 API"',
      `base_url = "${h}/v1"`,
      'env_key = "MUGUA_API_KEY"',
      'wire_api = "responses"'
    ].join('\n')
  }

  if (props.tool === 'opencode') {
    return JSON.stringify({
      $schema: 'https://opencode.ai/config.json',
      model: `mugua/${m}`,
      provider: {
        mugua: {
          npm: opencodePkg.value,
          name: '木瓜 API',
          options: {
            baseURL: `${h}/v1`,
            apiKey: '{env:MUGUA_API_KEY}'
          },
          models: {
            [m]: {
              name: m,
              limit: {
                context: 200000,
                output: 32000
              }
            }
          }
        }
      }
    }, null, 2)
  }

  return JSON.stringify({
    models: {
      mode: 'merge',
      providers: {
        mugua: {
          baseUrl: `${h}/v1`,
          apiKey: '${MUGUA_API_KEY}',
          api: openclawApi.value,
          models: [
            {
              id: m,
              name: m,
              reasoning: false,
              input: ['text', 'image'],
              contextWindow: 200000,
              maxTokens: 32000
            }
          ]
        }
      }
    },
    agents: {
      defaults: {
        model: {
          primary: `mugua/${m}`
        }
      }
    }
  }, null, 2)
})

function resetFields() {
  routeId.value = 'main'
  modelInput.value = ''
  tokenInput.value = ''
  opencodePkg.value = '@ai-sdk/openai-compatible'
  openclawApi.value = 'openai-responses'
}

async function copyConfig() {
  const text = generated.value
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
  <div class="mg-widget">
    <div class="mg-widget-head">
      <div>
        <strong class="mg-widget-title">快捷生成配置</strong>
        <p class="mg-widget-sub">填入模型 ID 并选好线路，直接复制可用片段。仅在当前浏览器内存中替换，不保存、不上传。</p>
      </div>
      <button type="button" class="mg-btn-ghost" @click="resetFields">重置</button>
    </div>

    <div class="mg-widget-controls">
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

      <div v-if="tool === 'opencode'" class="mg-seg-group" role="group" aria-label="选择协议包">
        <button
          v-for="item in opencodePkgs"
          :key="item.id"
          type="button"
          class="mg-seg-btn"
          :class="{ 'is-active': opencodePkg === item.id }"
          :aria-pressed="opencodePkg === item.id"
          @click="opencodePkg = item.id"
        >
          {{ item.label }}
        </button>
      </div>

      <div v-if="tool === 'openclaw'" class="mg-seg-group" role="group" aria-label="选择接口协议">
        <button
          v-for="item in openclawApis"
          :key="item.id"
          type="button"
          class="mg-seg-btn"
          :class="{ 'is-active': openclawApi === item.id }"
          :aria-pressed="openclawApi === item.id"
          @click="openclawApi = item.id"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="mg-fill-inputs">
      <label class="mg-field">
        <span>模型 ID（从模型广场复制）</span>
        <input
          v-model="modelInput"
          type="text"
          autocomplete="off"
          spellcheck="false"
          placeholder="留空保持 your-model-id"
        />
      </label>

      <label v-if="supportsDirectToken" class="mg-field">
        <span>令牌（可选，留空保持 your-api-key）</span>
        <div class="mg-input-wrap">
          <input
            v-model="tokenInput"
            :type="showToken ? 'text' : 'password'"
            autocomplete="off"
            spellcheck="false"
            placeholder="sk-..."
          />
          <button type="button" class="mg-input-toggle" @click="showToken = !showToken">
            {{ showToken ? '隐藏' : '显示' }}
          </button>
        </div>
      </label>
    </div>

    <div class="mg-code-box">
      <div class="mg-code-head">
        <span class="mg-code-path">{{ fileHint }}</span>
        <button type="button" class="mg-btn-primary mg-btn-sm" @click="copyConfig">
          {{ copied ? '已复制 ✓' : '复制配置' }}
        </button>
      </div>
      <pre class="mg-code-pre"><code>{{ generated }}</code></pre>
    </div>

    <p v-if="!supportsDirectToken" class="mg-widget-note">
      该工具通过环境变量 <code>MUGUA_API_KEY</code> 读取令牌，避免把密钥写死在配置文件里；请按下方步骤先设置环境变量。
    </p>
  </div>
</template>
