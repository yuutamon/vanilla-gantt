export function parseDate(value: string | Date): Date {
  if (value instanceof Date) return new Date(value.getTime());
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new Error(`Invalid date: ${value}`);
  return d;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return startOfDay(d);
}

export function diffDays(a: Date, b: Date): number {
  const msPerDay = 86400000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcA - utcB) / msPerDay);
}

export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

export function startOfMonth(date: Date): Date {
  const d = startOfDay(date);
  d.setDate(1);
  return d;
}

export function endOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function eachDayOfInterval(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  let current = startOfDay(start);
  const last = startOfDay(end);
  while (current <= last) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
}

export function eachWeekOfInterval(start: Date, end: Date): Date[] {
  const weeks: Date[] = [];
  let current = startOfWeek(start);
  const last = startOfDay(end);
  while (current <= last) {
    weeks.push(current);
    current = addDays(current, 7);
  }
  return weeks;
}

export function eachMonthOfInterval(start: Date, end: Date): Date[] {
  const months: Date[] = [];
  let current = startOfMonth(start);
  const last = startOfDay(end);
  while (current <= last) {
    months.push(current);
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    next.setHours(0, 0, 0, 0);
    current = next;
  }
  return months;
}
