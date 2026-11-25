<script>
let aiDocsCache = null
let aiDocsPromise = null
</script>

<script setup>
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter, page } = useData()

function loadAiDocs() {
  if (aiDocsCache) return Promise.resolve(aiDocsCache)
  if (!aiDocsPromise) {
    aiDocsPromise = fetch(withBase('/ai-docs.json'))
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) aiDocsCache = data
        return data
      })
      .catch(() => null)
  }
  return aiDocsPromise
}

const pageKey = computed(() => (page.value?.relativePath || '').replace(/\.md$/, ''))
const canCopy = computed(() => Boolean(pageKey.value) && pageKey.value !== 'index')
const status = ref('idle')
let timer = null

function writeClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  return new Promise((resolve, reject) => {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(el)
      if (ok) resolve()
      else reject(new Error('copy failed'))
    } catch (err) {
      reject(err)
    }
  })
}

async function copyForAi() {
  if (!canCopy.value) return
  try {
    const docs = aiDocsCache || (await loadAiDocs())
    let text = docs?.[pageKey.value]
    if (!text) {
      const main = document.querySelector('.vp-doc')
      text = `原文：${window.location.href}\n\n${main?.innerText?.trim() || ''}`
    }
    await writeClipboard(text)
    status.value = 'copied'
  } catch {
    status.value = 'error'
  }
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { status.value = 'idle' }, 2000)
}
</script>

<template>
  <div v-if="frontmatter.lastVerified || canCopy" class="doc-meta-bar">
    <div v-if="frontmatter.lastVerified" class="doc-meta">
      <span class="doc-meta-dot" aria-hidden="true" />
      上游资料核对 <time :datetime="String(frontmatter.lastVerified)">{{ frontmatter.lastVerified }}</time>
    </div>
    <span v-else />
    <button
      v-if="canCopy"
      type="button"
      class="doc-ai-copy"
      :class="{ 'is-copied': status === 'copied' }"
      title="复制本页纯 Markdown 文本，方便直接粘贴给 AI 工具阅读"
      @pointerenter="loadAiDocs"
      @focus="loadAiDocs"
      @click="copyForAi"
    >
      <svg class="doc-ai-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path
          v-if="status === 'copied'"
          d="M3.5 8.5l3 3 6-6.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-else
          d="M5.5 2.5h6a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 4 11.5V4a1.5 1.5 0 0 1 1.5-1.5zm-2 3H3A1.5 1.5 0 0 0 1.5 7v6A1.5 1.5 0 0 0 3 14.5h5.5A1.5 1.5 0 0 0 10 13v-.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.35"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ status === 'copied' ? '已复制本页 Markdown' : status === 'error' ? '复制失败，请重试' : '复制本页给 AI' }}</span>
    </button>
  </div>
</template>
