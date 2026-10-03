export function formatShortDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatCalendarDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isTaskOverdue(deadline: Date | null): boolean {
  if (!deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(deadline);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate.getTime() < today.getTime();
}

export function isDueToday(deadline: Date | null): boolean {
  if (!deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(deadline);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate.getTime() === today.getTime();
}

export function isDueThisWeek(deadline: Date | null): boolean {
  if (!deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const taskDate = new Date(deadline);
  taskDate.setHours(0, 0, 0, 0);
  return (
    taskDate.getTime() >= today.getTime() &&
    taskDate.getTime() <= nextWeek.getTime()
  );
}

export interface DeadlineInfo {
  text: string;
  badgeClass: string;
  isOverdue: boolean;
}

export function getDeadlineInfo(deadline: Date | null): DeadlineInfo | null {
  if (!deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(deadline);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      text: `Overdue by ${daysAgo}d (${formatShortDate(deadline)})`,
      badgeClass:
        "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
      isOverdue: true,
    };
  }

  if (diffDays === 0) {
    return {
      text: "Due Today ⚡",
      badgeClass:
        "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 font-semibold",
      isOverdue: false,
    };
  }

  if (diffDays === 1) {
    return {
      text: "Due Tomorrow ⏳",
      badgeClass:
        "bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60 font-semibold",
      isOverdue: false,
    };
  }

  if (diffDays <= 7) {
    return {
      text: `In ${diffDays} days (${formatShortDate(deadline)})`,
      badgeClass:
        "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
      isOverdue: false,
    };
  }

  return {
    text: formatShortDate(deadline),
    badgeClass:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    isOverdue: false,
  };
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Days from previous month to align first weekday
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    days.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
    });
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    days.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
    });
  }

  // Remaining days to complete weeks grid (35 or 42 cells)
  const totalCells = days.length <= 35 ? 35 : 42;
  const remaining = totalCells - days.length;
  for (let day = 1; day <= remaining; day++) {
    const date = new Date(year, month + 1, day);
    date.setHours(0, 0, 0, 0);
    days.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
    });
  }

  return days;
}
