import type { InternalTask, TimelineRange, ResolvedOptions } from './types.js';
import { dateToX } from './timeline.js';
import { startOfDay } from './date-utils.js';

export function renderGantt(
  container: HTMLElement,
  tasks: InternalTask[],
  timeline: TimelineRange,
  options: ResolvedOptions,
): void {
  container.innerHTML = '';
  container.classList.add('vg-container');

  const header = renderHeader(timeline, options);
  const body = renderBody(tasks, timeline, options);

  container.appendChild(header);
  container.appendChild(body);
}

function renderHeader(timeline: TimelineRange, _options: ResolvedOptions): HTMLElement {
  const header = document.createElement('div');
  header.className = 'vg-header';
  header.style.width = `${timeline.totalWidth}px`;

  for (const col of timeline.columns) {
    const cell = document.createElement('div');
    cell.className = 'vg-header-cell';
    cell.style.width = `${col.width}px`;
    cell.textContent = col.label;
    header.appendChild(cell);
  }

  return header;
}

function renderBody(
  tasks: InternalTask[],
  timeline: TimelineRange,
  options: ResolvedOptions,
): HTMLElement {
  const body = document.createElement('div');
  body.className = 'vg-body';

  const totalHeight = tasks.length * options.rowHeight;
  body.style.width = `${timeline.totalWidth}px`;
  body.style.height = `${totalHeight}px`;

  body.appendChild(renderGrid(timeline, totalHeight));
  body.appendChild(renderTodayHighlight(timeline, options, totalHeight));
  body.appendChild(renderDependencies(tasks));
  body.appendChild(renderBars(tasks));
  body.appendChild(renderRowLines(tasks.length, options.rowHeight));

  return body;
}

function renderGrid(timeline: TimelineRange, height: number): HTMLElement {
  const grid = document.createElement('div');
  grid.className = 'vg-grid';

  for (const col of timeline.columns) {
    const line = document.createElement('div');
    line.className = 'vg-grid-line';
    line.style.left = `${col.x}px`;
    line.style.height = `${height}px`;
    grid.appendChild(line);
  }

  return grid;
}

function renderTodayHighlight(
  timeline: TimelineRange,
  options: ResolvedOptions,
  height: number,
): HTMLElement {
  const wrapper = document.createElement('div');
  const today = startOfDay(new Date());
  const x = dateToX(today, timeline.startDate, options.viewMode, options.columnWidth);

  if (x >= 0 && x <= timeline.totalWidth) {
    const highlight = document.createElement('div');
    highlight.className = 'vg-today-highlight';
    highlight.style.left = `${x}px`;
    highlight.style.width = `${options.columnWidth}px`;
    highlight.style.height = `${height}px`;
    wrapper.appendChild(highlight);
  }

  return wrapper;
}

function renderDependencies(tasks: InternalTask[]): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('vg-dependencies');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'vg-arrowhead');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '6');
  marker.setAttribute('refX', '8');
  marker.setAttribute('refY', '3');
  marker.setAttribute('orient', 'auto');
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0 0, 8 3, 0 6');
  polygon.setAttribute('fill', 'var(--vg-arrow-color, #999)');
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);

  const taskMap = new Map(tasks.map(t => [t.id, t]));

  for (const task of tasks) {
    for (const depId of task.dependencies) {
      const dep = taskMap.get(depId);
      if (!dep) continue;

      const startX = dep.x + dep.width;
      const startY = dep.y + dep.height / 2;
      const endX = task.x;
      const endY = task.y + task.height / 2;

      const midX = startX + (endX - startX) / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.classList.add('vg-dependency-path');
      path.setAttribute('d', `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`);
      svg.appendChild(path);
    }
  }

  return svg;
}

function renderBars(tasks: InternalTask[]): HTMLElement {
  const barsContainer = document.createElement('div');
  barsContainer.className = 'vg-bars';

  for (const task of tasks) {
    const wrapper = document.createElement('div');
    wrapper.className = 'vg-bar-wrapper';
    wrapper.dataset.taskId = task.id;
    wrapper.style.left = `${task.x}px`;
    wrapper.style.top = `${task.y}px`;
    wrapper.style.width = `${task.width}px`;
    wrapper.style.height = `${task.height}px`;

    const bar = document.createElement('div');
    bar.className = 'vg-bar';
    if (task.color) {
      bar.style.background = task.color;
    }

    const progress = document.createElement('div');
    progress.className = 'vg-bar-progress';
    progress.style.width = `${task.progress}%`;

    const label = document.createElement('div');
    label.className = 'vg-bar-label';
    label.textContent = task.name;

    bar.appendChild(progress);
    bar.appendChild(label);
    wrapper.appendChild(bar);
    barsContainer.appendChild(wrapper);
  }

  return barsContainer;
}

function renderRowLines(count: number, rowHeight: number): HTMLElement {
  const wrapper = document.createElement('div');
  for (let i = 1; i <= count; i++) {
    const line = document.createElement('div');
    line.className = 'vg-row-line';
    line.style.top = `${i * rowHeight}px`;
    wrapper.appendChild(line);
  }
  return wrapper;
}
