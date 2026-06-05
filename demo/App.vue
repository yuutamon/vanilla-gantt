<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { VanillaGantt } from '../src/index.js';
import type { Task, ViewMode } from '../src/types.js';

const VIEW_MODES: ViewMode[] = ['day', 'week', 'month'];

const tasks: Task[] = [
  {
    id: '1',
    name: 'Research',
    start: '2026-03-01',
    end: '2026-03-07',
    progress: 100,
    color: '#4e8af0',
  },
  {
    id: '2',
    name: 'Design',
    start: '2026-03-08',
    end: '2026-03-14',
    progress: 80,
    dependencies: ['1'],
    color: '#f0a04e',
  },
  {
    id: '3',
    name: 'Development',
    start: '2026-03-15',
    end: '2026-04-05',
    progress: 40,
    dependencies: ['2'],
    color: '#4ecaf0',
  },
  {
    id: '4',
    name: 'Testing',
    start: '2026-04-06',
    end: '2026-04-15',
    progress: 0,
    dependencies: ['3'],
    color: '#f04e8a',
  },
  {
    id: '5',
    name: 'Deployment',
    start: '2026-04-16',
    end: '2026-04-20',
    progress: 0,
    dependencies: ['4'],
    color: '#8af04e',
  },
];

const selectedMode = ref<ViewMode>('day');
const ganttEl = ref<HTMLElement | null>(null);

let gantt: VanillaGantt | null = null;

const setViewMode = (mode: ViewMode) => {
  selectedMode.value = mode;
  gantt?.setViewMode(mode);
};

onMounted(() => {
  if (!ganttEl.value) return;

  gantt = new VanillaGantt(ganttEl.value, {
    tasks,
    viewMode: selectedMode.value,
    columnWidth: 40,
  });

  gantt.on('task-click', ({ task }) => {
    console.log('Task clicked:', task.name, task);
  });

  gantt.on('task-dblclick', ({ task }) => {
    console.log('Task double-clicked:', task.name, task);
  });

  gantt.on('view-change', ({ mode }) => {
    console.log('View mode changed:', mode);
  });
});

onBeforeUnmount(() => {
  gantt?.destroy();
  gantt = null;
});
</script>

<template>
  <main class="demo">
    <h1>vanilla-gantt Demo</h1>
    <div class="controls">
      <button
        v-for="mode in VIEW_MODES"
        :key="mode"
        class="view-btn"
        :class="{ active: selectedMode === mode }"
        type="button"
        @click="setViewMode(mode)"
      >
        {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
      </button>
    </div>
    <div ref="ganttEl" class="gantt"></div>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fafafa;
  color: #333;
}

.demo {
  padding: 24px;
}

h1 {
  margin: 0 0 16px;
  font-size: 24px;
}

.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.view-btn {
  padding: 6px 16px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.view-btn.active {
  background: #4e8af0;
  color: #fff;
  border-color: #4e8af0;
}

.gantt {
  width: 100%;
  height: 400px;
}

@media (prefers-color-scheme: dark) {
  body {
    background: #121212;
    color: #d4d4d4;
  }

  .view-btn {
    background: #2a2a2a;
    border-color: #555;
    color: #d4d4d4;
  }

  .view-btn.active {
    background: #4e8af0;
    border-color: #4e8af0;
    color: #fff;
  }
}
</style>
