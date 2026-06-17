<template>
  <div class="gantt-chart">
    <div ref="timelineContainer" class="timeline-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Timeline, DataSet } from 'vis-timeline/standalone'
import type { TimelineOptions } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

export type GanttGroup = {
  id: number | string
  content: string
}

export type GanttItem = {
  id: number | string
  group: number | string
  content: string
  start: string | Date
  end?: string | Date
  className?: string
  title?: string
}

const props = withDefaults(
  defineProps<{
    groups: GanttGroup[]
    items: GanttItem[]
    options?: TimelineOptions
    autoFit?: boolean
  }>(),
  {
    autoFit: true,
  }
)

const emit = defineEmits<{
  select: [itemIds: Array<string | number>]
}>()

const timelineContainer = ref<HTMLElement | null>(null)
const timeline = ref<Timeline | null>(null)

const defaultOptions: TimelineOptions = {
  stack: false,
  horizontalScroll: true,
  zoomKey: 'ctrlKey',
  orientation: {
    axis: 'top',
    item: 'top',
  },
  margin: {
    item: 12,
    axis: 8,
  },
  editable: false,
  showCurrentTime: true,
  tooltip: {
    followMouse: true,
  },
  locale: 'ja',
}

function createDataSets() {
  return {
    groups: new DataSet(props.groups),
    items: new DataSet(props.items),
  }
}

function updateTimelineData() {
  if (!timeline.value) return

  const data = createDataSets()

  timeline.value.setData({
    groups: data.groups,
    items: data.items,
  })

  if (props.autoFit && props.items.length > 0) {
    timeline.value.fit()
  }
}

async function initTimeline() {
  await nextTick()

  if (!timelineContainer.value || timeline.value) return

  const data = createDataSets()

  timeline.value = new Timeline(
    timelineContainer.value,
    data.items,
    data.groups,
    {
      ...defaultOptions,
      ...props.options,
    }
  )

  timeline.value.on('select', (properties) => {
    emit('select', properties.items as Array<string | number>)
  })

  if (props.autoFit && props.items.length > 0) {
    timeline.value.fit()
  }
}

onMounted(() => {
  initTimeline()
})

watch(
  () => [props.groups, props.items],
  () => {
    updateTimelineData()
  },
  {
    deep: true,
  }
)

watch(
  () => props.options,
  (newOptions) => {
    if (!timeline.value || !newOptions) return

    timeline.value.setOptions({
      ...defaultOptions,
      ...newOptions,
    })
  },
  {
    deep: true,
  }
)

onBeforeUnmount(() => {
  if (timeline.value) {
    timeline.value.destroy()
    timeline.value = null
  }
})
</script>

<style scoped>
.gantt-chart {
  width: 100%;
}

.timeline-container {
  width: 100%;
  height: 480px;
  border: 1px solid #ddd;
}

/* vis-timeline内部のスタイル調整 */
:deep(.vis-item) {
  border-radius: 6px;
  font-size: 13px;
}

:deep(.vis-item.vis-range) {
  border-width: 1px;
}

/* item.className に応じた装飾 */
:deep(.vis-item.done) {
  opacity: 0.7;
}

:deep(.vis-item.critical) {
  font-weight: bold;
}
</style>