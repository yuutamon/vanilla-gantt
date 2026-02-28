import { VanillaGantt } from '../src/index.js';
import type { ViewMode, Task } from '../src/types.js';

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

const gantt = new VanillaGantt('#gantt', {
  tasks,
  viewMode: 'day',
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

const buttons = document.querySelectorAll<HTMLButtonElement>('.view-btn');
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode as ViewMode;
    gantt.setViewMode(mode);
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
