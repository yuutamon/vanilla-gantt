import type { ViewMode, TimelineColumn, TimelineRange, InternalTask } from './types.js';
import {
  startOfDay, addDays, diffDays, startOfWeek, startOfMonth,
  endOfMonth, formatDate,
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
} from './date-utils.js';

export function computeTimeline(
  tasks: InternalTask[],
  viewMode: ViewMode,
  columnWidth: number,
  locale: string,
): TimelineRange {
  if (tasks.length === 0) {
    const today = startOfDay(new Date());
    return {
      columns: [],
      totalWidth: 0,
      startDate: today,
      endDate: today,
    };
  }

  let minDate = tasks[0].start;
  let maxDate = tasks[0].end;
  for (const task of tasks) {
    if (task.start < minDate) minDate = task.start;
    if (task.end > maxDate) maxDate = task.end;
  }

  const paddingDays = viewMode === 'month' ? 30 : viewMode === 'week' ? 7 : 3;
  const rangeStart = addDays(minDate, -paddingDays);
  const rangeEnd = addDays(maxDate, paddingDays);

  let columns: TimelineColumn[];

  switch (viewMode) {
    case 'day': {
      const days = eachDayOfInterval(rangeStart, rangeEnd);
      columns = days.map((date, i) => ({
        date,
        label: formatDate(date, locale, { month: 'short', day: 'numeric' }),
        x: i * columnWidth,
        width: columnWidth,
      }));
      break;
    }
    case 'week': {
      const weeks = eachWeekOfInterval(rangeStart, rangeEnd);
      columns = weeks.map((date, i) => ({
        date,
        label: formatDate(date, locale, { month: 'short', day: 'numeric' }),
        x: i * columnWidth,
        width: columnWidth,
      }));
      break;
    }
    case 'month': {
      const months = eachMonthOfInterval(rangeStart, rangeEnd);
      columns = months.map((date, i) => ({
        date,
        label: formatDate(date, locale, { year: 'numeric', month: 'short' }),
        x: i * columnWidth,
        width: columnWidth,
      }));
      break;
    }
  }

  const totalWidth = columns.length * columnWidth;
  const startDate = columns.length > 0 ? columns[0].date : rangeStart;
  const endDate = columns.length > 0 ? columns[columns.length - 1].date : rangeEnd;

  return { columns, totalWidth, startDate, endDate };
}

export function dateToX(
  date: Date,
  rangeStart: Date,
  viewMode: ViewMode,
  columnWidth: number,
): number {
  const d = startOfDay(date);
  switch (viewMode) {
    case 'day': {
      return diffDays(d, rangeStart) * columnWidth;
    }
    case 'week': {
      const weekStart = startOfWeek(rangeStart);
      const days = diffDays(d, weekStart);
      return (days / 7) * columnWidth;
    }
    case 'month': {
      const monthStart = startOfMonth(rangeStart);
      const yearDiff = d.getFullYear() - monthStart.getFullYear();
      const monthDiff = d.getMonth() - monthStart.getMonth() + yearDiff * 12;
      const daysInMonth = endOfMonth(d).getDate();
      const dayFraction = (d.getDate() - 1) / daysInMonth;
      return (monthDiff + dayFraction) * columnWidth;
    }
  }
}

export function xToDate(
  x: number,
  rangeStart: Date,
  viewMode: ViewMode,
  columnWidth: number,
): Date {
  switch (viewMode) {
    case 'day': {
      const days = Math.round(x / columnWidth);
      return addDays(rangeStart, days);
    }
    case 'week': {
      const weekStart = startOfWeek(rangeStart);
      const days = Math.round((x / columnWidth) * 7);
      return addDays(weekStart, days);
    }
    case 'month': {
      const monthStart = startOfMonth(rangeStart);
      const months = Math.floor(x / columnWidth);
      const fraction = (x % columnWidth) / columnWidth;
      const targetDate = new Date(monthStart.getFullYear(), monthStart.getMonth() + months, 1);
      const daysInMonth = endOfMonth(targetDate).getDate();
      const day = Math.round(fraction * daysInMonth) + 1;
      targetDate.setDate(day);
      targetDate.setHours(0, 0, 0, 0);
      return targetDate;
    }
  }
}
