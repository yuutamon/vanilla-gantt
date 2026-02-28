import type {
  Task, InternalTask, GanttOptions, ResolvedOptions,
  ViewMode, GanttEventMap, TimelineRange,
} from './types.js';
import { parseDate, startOfDay } from './date-utils.js';
import { computeTimeline, dateToX } from './timeline.js';
import { renderGantt } from './renderer.js';

const DEFAULT_OPTIONS: ResolvedOptions = {
  tasks: [],
  viewMode: 'day',
  columnWidth: 40,
  rowHeight: 44,
  barHeight: 28,
  padding: 8,
  locale: 'en-US',
};

type EventHandler<K extends keyof GanttEventMap> = (payload: GanttEventMap[K]) => void;
type AnyHandler = (payload: never) => void;

export class VanillaGantt {
  private container: HTMLElement;
  private options: ResolvedOptions;
  private tasks: InternalTask[] = [];
  private rawTasks: Task[] = [];
  private timeline: TimelineRange = { columns: [], totalWidth: 0, startDate: new Date(), endDate: new Date() };
  private listeners = new Map<string, Set<AnyHandler>>();

  constructor(container: string | HTMLElement, options?: GanttOptions) {
    if (typeof container === 'string') {
      const el = document.querySelector<HTMLElement>(container);
      if (!el) throw new Error(`Container not found: ${container}`);
      this.container = el;
    } else {
      this.container = container;
    }

    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.rawTasks = [...(this.options.tasks || [])];

    this.refresh();
    this.bindEvents();
  }

  addTask(task: Task): void {
    this.rawTasks.push(task);
    this.refresh();
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const index = this.rawTasks.findIndex(t => t.id === id);
    if (index === -1) return;
    this.rawTasks[index] = { ...this.rawTasks[index], ...updates };
    this.refresh();
  }

  removeTask(id: string): void {
    this.rawTasks = this.rawTasks.filter(t => t.id !== id);
    this.refresh();
  }

  getTasks(): InternalTask[] {
    return [...this.tasks];
  }

  setViewMode(mode: ViewMode): void {
    if (this.options.viewMode === mode) return;
    this.options.viewMode = mode;
    this.refresh();
    this.emit('view-change', { mode });
  }

  scrollToDate(date: string | Date): void {
    const d = parseDate(date);
    const x = dateToX(d, this.timeline.startDate, this.options.viewMode, this.options.columnWidth);
    this.container.scrollLeft = Math.max(0, x - this.container.clientWidth / 3);
  }

  scrollToToday(): void {
    this.scrollToDate(new Date());
  }

  on<K extends keyof GanttEventMap>(event: K, handler: EventHandler<K>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as AnyHandler);
  }

  off<K extends keyof GanttEventMap>(event: K, handler: EventHandler<K>): void {
    this.listeners.get(event)?.delete(handler as AnyHandler);
  }

  destroy(): void {
    this.listeners.clear();
    this.container.innerHTML = '';
    this.container.classList.remove('vg-container');
  }

  private emit<K extends keyof GanttEventMap>(event: K, payload: GanttEventMap[K]): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      (handler as EventHandler<K>)(payload);
    }
  }

  private refresh(): void {
    this.tasks = this.normalizeTasks(this.rawTasks);
    this.timeline = computeTimeline(
      this.tasks,
      this.options.viewMode,
      this.options.columnWidth,
      this.options.locale,
    );
    this.layoutTasks();
    renderGantt(this.container, this.tasks, this.timeline, this.options);
    this.bindEvents();
  }

  private normalizeTasks(tasks: Task[]): InternalTask[] {
    return tasks.map((t, i) => ({
      id: t.id,
      name: t.name,
      start: startOfDay(parseDate(t.start)),
      end: startOfDay(parseDate(t.end)),
      progress: t.progress ?? 0,
      dependencies: t.dependencies ?? [],
      color: t.color ?? '',
      x: 0,
      y: 0,
      width: 0,
      height: this.options.barHeight,
      row: i,
    }));
  }

  private layoutTasks(): void {
    const { viewMode, columnWidth, rowHeight, barHeight, padding } = this.options;

    for (const task of this.tasks) {
      const x = dateToX(task.start, this.timeline.startDate, viewMode, columnWidth);
      const xEnd = dateToX(task.end, this.timeline.startDate, viewMode, columnWidth);
      const width = Math.max(xEnd - x + columnWidth, columnWidth);

      task.x = x;
      task.width = width;
      task.height = barHeight;
      task.y = task.row * rowHeight + padding;
    }
  }

  private bindEvents(): void {
    const bars = this.container.querySelector('.vg-bars');
    if (!bars) return;

    bars.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('.vg-bar-wrapper');
      if (!target) return;
      const taskId = target.dataset.taskId;
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        this.emit('task-click', { task, event: e as MouseEvent });
      }
    });

    bars.addEventListener('dblclick', (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('.vg-bar-wrapper');
      if (!target) return;
      const taskId = target.dataset.taskId;
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        this.emit('task-dblclick', { task, event: e as MouseEvent });
      }
    });
  }
}
