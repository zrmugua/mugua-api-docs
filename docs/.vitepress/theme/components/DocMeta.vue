<script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.lastVerified" class="doc-meta">
    <span class="doc-meta-dot" aria-hidden="true" />
    上游资料核对 <time :datetime="String(frontmatter.lastVerified)">{{ frontmatter.lastVerified }}</time>
  </div>
</template>
