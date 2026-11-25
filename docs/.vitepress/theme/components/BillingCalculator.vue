<script setup>
import { computed, ref } from 'vue'

const RATE_CNY_PER_USD = 0.5
const REF_EXCHANGE = 7.3

const mode = ref('price')
const officialUsd = ref(3)
const groupRatio = ref(1)
const topupCny = ref(50)

const pricePresets = [0.5, 2, 3, 5, 15]
const ratioPresets = [0.3, 0.5, 0.8, 1, 2.4]
const topupPresets = [10, 50, 100, 500]

const safeOfficial = computed(() => {
  const n = Number(officialUsd.value)
  return Number.isFinite(n) && n >= 0 ? n : 0
})

const safeRatio = computed(() => {
  const n = Number(groupRatio.value)
  return Number.isFinite(n) && n >= 0 ? n : 0
})

const safeTopup = computed(() => {
  const n = Number(topupCny.value)
  return Number.isFinite(n) && n >= 0 ? n : 0
})

const actualCny = computed(() => safeOfficial.value * safeRatio.value * RATE_CNY_PER_USD)
const equivalentRatio = computed(() => safeRatio.value * RATE_CNY_PER_USD)
const discountRatio = computed(() => (safeRatio.value * RATE_CNY_PER_USD) / REF_EXCHANGE)
const topupUsd = computed(() => safeTopup.value / RATE_CNY_PER_USD)

function fmt(num, digits = 2) {
  if (!Number.isFinite(num)) return '0'
  return Number(num.toFixed(digits)).toString()
}
</script>

<template>
  <div class="mg-widget">
    <div class="mg-widget-head">
      <div>
        <strong class="mg-widget-title">计费与等效倍率换算</strong>
        <p class="mg-widget-sub">按本站 0.5 元 = 1 美元额度实时换算，实际单价以控制台模型广场为准。</p>
      </div>
      <div class="mg-seg-group" role="group" aria-label="换算模式">
        <button
          type="button"
          class="mg-seg-btn"
          :class="{ 'is-active': mode === 'price' }"
          :aria-pressed="mode === 'price'"
          @click="mode = 'price'"
        >
          单价与倍率
        </button>
        <button
          type="button"
          class="mg-seg-btn"
          :class="{ 'is-active': mode === 'topup' }"
          :aria-pressed="mode === 'topup'"
          @click="mode = 'topup'"
        >
          充值额度
        </button>
      </div>
    </div>

    <div v-if="mode === 'price'" class="mg-calc-body">
      <div class="mg-calc-inputs">
        <label class="mg-field">
          <span>官方价格（美元 / 1M tokens）</span>
          <input v-model.number="officialUsd" type="number" min="0" step="0.1" inputmode="decimal" />
          <div class="mg-chips">
            <button
              v-for="v in pricePresets"
              :key="v"
              type="button"
              class="mg-chip"
              :class="{ 'is-active': safeOfficial === v }"
              @click="officialUsd = v"
            >
              ${{ v }}
            </button>
          </div>
        </label>

        <label class="mg-field">
          <span>控制台分组倍率</span>
          <input v-model.number="groupRatio" type="number" min="0" step="0.1" inputmode="decimal" />
          <div class="mg-chips">
            <button
              v-for="v in ratioPresets"
              :key="v"
              type="button"
              class="mg-chip"
              :class="{ 'is-active': safeRatio === v }"
              @click="groupRatio = v"
            >
              {{ v }}x
            </button>
          </div>
        </label>
      </div>

      <div class="mg-calc-results">
        <div class="mg-stat">
          <span class="mg-stat-label">本站实际成本</span>
          <strong class="mg-stat-value">¥{{ fmt(actualCny, 3) }}</strong>
          <span class="mg-stat-note">每 1M tokens（美元额度 × 0.5）</span>
        </div>
        <div class="mg-stat">
          <span class="mg-stat-label">等效常规站倍率</span>
          <strong class="mg-stat-value">{{ fmt(equivalentRatio, 2) }}x</strong>
          <span class="mg-stat-note">折合 1 元 = 1 美元额度站点</span>
        </div>
        <div class="mg-stat">
          <span class="mg-stat-label">相对官价参考</span>
          <strong class="mg-stat-value">{{ fmt(discountRatio * 100, 1) }}%</strong>
          <span class="mg-stat-note">按 1 美元 ≈ ¥{{ REF_EXCHANGE }} 估算</span>
        </div>
      </div>
    </div>

    <div v-else class="mg-calc-body">
      <div class="mg-calc-inputs">
        <label class="mg-field">
          <span>充值金额（人民币元）</span>
          <input v-model.number="topupCny" type="number" min="0" step="10" inputmode="decimal" />
          <div class="mg-chips">
            <button
              v-for="v in topupPresets"
              :key="v"
              type="button"
              class="mg-chip"
              :class="{ 'is-active': safeTopup === v }"
              @click="topupCny = v"
            >
              ¥{{ v }}
            </button>
          </div>
        </label>
      </div>

      <div class="mg-calc-results mg-calc-results-2">
        <div class="mg-stat">
          <span class="mg-stat-label">实付人民币</span>
          <strong class="mg-stat-value">¥{{ fmt(safeTopup, 2) }}</strong>
          <span class="mg-stat-note">按量计费，无月费订阅</span>
        </div>
        <div class="mg-stat">
          <span class="mg-stat-label">到账美元额度</span>
          <strong class="mg-stat-value">${{ fmt(topupUsd, 2) }}</strong>
          <span class="mg-stat-note">0.5 元人民币 = 1 美元额度</span>
        </div>
      </div>
    </div>
  </div>
</template>
