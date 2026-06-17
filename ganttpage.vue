<template>
  <section class="page">
    <header class="page-header">
      <h1>プロジェクト進捗</h1>

      <button type="button" @click="fetchGanttData" :disabled="loading">
        {{ loading ? '読み込み中...' : '再読み込み' }}
      </button>
    </header>

    <p v-if="error" class="error">
      {{ error }}
    </p>

    <p v-if="loading" class="loading">
      ガントチャートを読み込んでいます...
    </p>

    <GanttChart
      v-else
      :groups="groups"
      :items="items"
      :options="timelineOptions"
      :auto-fit="true"
      @select="handleSelect"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GanttChart from '@/components/GanttChart.vue'
import type {
  GanttGroup,
  GanttItem,
} from '@/components/GanttChart.vue'
import type { TimelineOptions } from 'vis-timeline/standalone'

const groups = ref<GanttGroup[]>([])
const items = ref<GanttItem[]>([])

const loading = ref(false)
const error = ref<string | null>(null)

const timelineOptions: TimelineOptions = {
  stack: false,
  editable: false,
  zoomMin: 1000 * 60 * 60 * 24,
  zoomMax: 1000 * 60 * 60 * 24 * 365,
}

async function fetchGanttData() {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('/api/gantt')

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data: {
      groups: GanttGroup[]
      items: GanttItem[]
    } = await response.json()

    groups.value = data.groups
    items.value = data.items
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : 'ガントチャートの取得に失敗しました'
  } finally {
    loading.value = false
  }
}

function handleSelect(itemIds: Array<string | number>) {
  console.log('selected item ids:', itemIds)
}

onMounted(() => {
  fetchGanttData()
})
</script>

<style scoped>
.page {
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.error {
  color: #c00;
}

.loading {
  color: #666;
}
</style>