export type ViewMode = 'day' | 'week' | 'month';

export interface Task {
  id: string;
  name: string;
  start: string | Date;
  end: string | Date;
  progress?: number;
  dependencies?: string[];
  color?: string;
}

export interface InternalTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies: string[];
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
}

export interface GanttOptions {
  tasks?: Task[];
  viewMode?: ViewMode;
  columnWidth?: number;
  rowHeight?: number;
  barHeight?: number;
  padding?: number;
  locale?: string;
}

export interface ResolvedOptions {
  tasks: Task[];
  viewMode: ViewMode;
  columnWidth: number;
  rowHeight: number;
  barHeight: number;
  padding: number;
  locale: string;
}

export interface GanttEventMap {
  'task-click': { task: InternalTask; event: MouseEvent };
  'task-dblclick': { task: InternalTask; event: MouseEvent };
  'view-change': { mode: ViewMode };
}

export interface TimelineColumn {
  date: Date;
  label: string;
  x: number;
  width: number;
}

export interface TimelineRange {
  columns: TimelineColumn[];
  totalWidth: number;
  startDate: Date;
  endDate: Date;
}
