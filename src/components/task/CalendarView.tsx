"use client";

import { useMemo, useState } from "react";
import { Task } from "../../types/task";
import { TaskCard } from "./TaskCard";
import {
  formatMonthYear,
  formatCalendarDate,
  getCalendarDays,
  isSameDay,
  isDueToday,
  isTaskOverdue,
} from "../../utils/dates";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({
  tasks,
  onTaskClick,
}: {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(
    () => getCalendarDays(year, month),
    [year, month]
  );

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  // Group tasks by date string (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      if (task.deadline) {
        const d = new Date(task.deadline);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const existing = map.get(key) || [];
        existing.push(task);
        map.set(key, existing);
      }
    }
    return map;
  }, [tasks]);

  // Tasks for the selected date (used for mobile day agenda)
  const selectedDayTasks = useMemo(() => {
    const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    return tasksByDate.get(key) || [];
  }, [selectedDate, tasksByDate]);

  // Tasks without deadline
  const unscheduledTasks = useMemo(
    () => tasks.filter((t) => !t.deadline),
    [tasks]
  );

  return (
    <div className="space-y-4">
      {/* Notion-style Calendar Navigation Bar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
          {formatMonthYear(currentDate)}
        </h2>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={jumpToToday}
            className="px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#202020] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shadow-2xs touch-manipulation min-h-[38px] flex items-center"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-[#202020] shadow-2xs overflow-hidden">
            <button
              onClick={prevMonth}
              className="p-2 sm:p-1.5 px-3 sm:px-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-colors touch-manipulation min-h-[38px] flex items-center justify-center"
              title="Previous month"
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-750" />
            <button
              onClick={nextMonth}
              className="p-2 sm:p-1.5 px-3 sm:px-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-colors touch-manipulation min-h-[38px] flex items-center justify-center"
              title="Next month"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Notion-style Calendar Grid Container */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-xs">
        {/* Weekday Row */}
        <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-[#1f1f1f] text-center">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 divide-x divide-y divide-zinc-200 dark:divide-zinc-800/80">
          {calendarDays.map((cell, idx) => {
            const dateKey = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
            const dayTasks = tasksByDate.get(dateKey) || [];
            const isTodayCell = cell.isToday;
            const isSelected = isSameDay(cell.date, selectedDate);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(cell.date)}
                className={`min-h-[56px] sm:min-h-[70px] md:min-h-[130px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors cursor-pointer touch-manipulation select-none ${
                  cell.isCurrentMonth
                    ? "bg-white dark:bg-[#191919]"
                    : "bg-[#fafaf9] dark:bg-[#141414] text-zinc-300 dark:text-zinc-700"
                } ${
                  isSelected
                    ? "ring-2 ring-indigo-500 ring-inset bg-indigo-50/40 dark:bg-indigo-950/30"
                    : isTodayCell
                    ? "bg-amber-50/20 dark:bg-amber-950/10 ring-1 ring-inset ring-amber-400/50"
                    : "hover:bg-zinc-50/80 dark:hover:bg-[#202020]/60"
                }`}
              >
                {/* Cell Header: Day Number */}
                <div className="flex items-center justify-between w-full mb-1">
                  {isTodayCell ? (
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center shadow-xs">
                      {cell.dayNumber}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-medium px-0.5 ${
                        cell.isCurrentMonth
                          ? "text-zinc-700 dark:text-zinc-300"
                          : "text-zinc-300 dark:text-zinc-600"
                      } ${isSelected ? "font-bold text-indigo-600 dark:text-indigo-400" : ""}`}
                    >
                      {cell.dayNumber}
                    </span>
                  )}

                  {/* Task count on desktop */}
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-zinc-400 font-medium hidden md:inline">
                      {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
                    </span>
                  )}
                </div>

                {/* Mobile Dot Indicators (< md breakpoint) */}
                <div className="flex md:hidden items-center justify-center gap-1 py-1">
                  {dayTasks.slice(0, 3).map((task, dotIdx) => {
                    const overdue = isTaskOverdue(task.deadline);
                    const todayDue = isDueToday(task.deadline);
                    return (
                      <span
                        key={dotIdx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          overdue
                            ? "bg-rose-500"
                            : todayDue
                            ? "bg-amber-500"
                            : "bg-indigo-500"
                        }`}
                      />
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-zinc-400 font-semibold leading-none">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>

                {/* Desktop Task Cards (>= md breakpoint) */}
                <div className="hidden md:block flex-1 space-y-1.5 overflow-y-auto max-h-[85px] no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
                  {dayTasks.map((task) => {
                    const overdue = isTaskOverdue(task.deadline);
                    const todayDue = isDueToday(task.deadline);

                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick?.(task);
                        }}
                        className="w-full text-left p-1.5 px-2 rounded-lg bg-white dark:bg-[#252525] border border-zinc-200/90 dark:border-zinc-700/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-xs hover:border-zinc-300 dark:hover:border-zinc-500 transition-all block group cursor-pointer"
                        title={`${task.course ? `[${task.course}] ` : ""}${task.title}`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {overdue ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          ) : todayDue ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          )}
                          {task.course && (
                            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 truncate max-w-[85%]">
                              {task.course}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Day Agenda Section (Displayed on phones when a day is tapped) */}
      <div className="md:hidden p-4 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {formatCalendarDate(selectedDate)}
            </span>
            {isSameDay(selectedDate, new Date()) && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                Today
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            {selectedDayTasks.length}{" "}
            {selectedDayTasks.length === 1 ? "deadline" : "deadlines"}
          </span>
        </div>

        {selectedDayTasks.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            No assignments due on this date. Tap any date above to see its schedule.
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayTasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>
        )}
      </div>

      {/* Unscheduled Assignments Drawer */}
      {unscheduledTasks.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <span>📌</span>
              <span>No Date ({unscheduledTasks.length})</span>
            </h3>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              Assignments with no set deadline
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {unscheduledTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onTaskClick?.(task)}
                className="text-left p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-[#fafaf9] dark:bg-[#202020] hover:bg-zinc-100 dark:hover:bg-zinc-750 active:scale-[0.99] transition-all text-xs space-y-1 shadow-2xs touch-manipulation"
              >
                <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {task.title}
                </div>
                {task.course && (
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    📚 {task.course}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}