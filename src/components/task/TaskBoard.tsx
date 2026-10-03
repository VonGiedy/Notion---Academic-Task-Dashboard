"use client";

import { useMemo, useState } from "react";
import { Task } from "../../types/task";
import { TaskList } from "./TaskList";
import { CalendarView } from "./CalendarView";
import { TimelineView } from "./TimelineView";
import { TaskDetailModal } from "./TaskDetailModal";
import { filterTasks, TimeFilter } from "../../utils/filters";
import { isDueThisWeek, isTaskOverdue } from "../../utils/dates";

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "grid" | "timeline">("calendar");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("upcoming");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // All unique subjects
  const uniqueCourses = useMemo(() => {
    const set = new Set<string>();
    for (const task of tasks) {
      if (task.course) set.add(task.course);
    }
    return Array.from(set).sort();
  }, [tasks]);

  // Active assignment counts per subject (excluding past deadlines)
  const courseCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const task of tasks) {
      if (task.course && !isTaskOverdue(task.deadline)) {
        counts.set(task.course, (counts.get(task.course) || 0) + 1);
      }
    }
    return counts;
  }, [tasks]);

  // Overall statistics for classmates (excluding past deadlines for total assignments)
  const stats = useMemo(() => {
    const activeTasks = tasks.filter((t) => !isTaskOverdue(t.deadline));
    const total = activeTasks.length;
    const dueThisWeek = tasks.filter((t) => isDueThisWeek(t.deadline)).length;
    return {
      total,
      dueThisWeek,
      totalCourses: uniqueCourses.length,
    };
  }, [tasks, uniqueCourses]);

  // In Calendar view, all deadlines are visible (only filtered by course and search)
  const calendarTasks = useMemo(
    () => filterTasks(tasks, selectedCourse, searchQuery, "all"),
    [tasks, selectedCourse, searchQuery]
  );

  const filteredTasks = useMemo(
    () => filterTasks(tasks, selectedCourse, searchQuery, timeFilter),
    [tasks, selectedCourse, searchQuery, timeFilter]
  );

  return (
    <div className="space-y-5">
      {/* Notion-style Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1f1f1f] border border-zinc-200/90 dark:border-zinc-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center text-base font-semibold">
            📋
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {stats.total}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Upcoming Deadlines
            </div>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1f1f1f] border border-zinc-200/90 dark:border-zinc-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-base font-semibold">
            ⚡
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {stats.dueThisWeek}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Due This Week
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1f1f1f] border border-zinc-200/90 dark:border-zinc-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center text-base font-semibold">
            📚
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {stats.totalCourses}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Active Subjects
            </div>
          </div>
        </div>
      </div>

      {/* Clean, Unified Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center pt-1 border-b border-zinc-200/70 dark:border-zinc-800/80 pb-3">
        {/* View Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 touch-manipulation min-h-[36px] ${
              viewMode === "calendar"
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <span>📅</span>
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 touch-manipulation min-h-[36px] ${
              viewMode === "grid"
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <span>🗂️</span>
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 touch-manipulation min-h-[36px] ${
              viewMode === "timeline"
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <span>⏱️</span>
            <span>Timeline</span>
          </button>
        </div>

        {/* Compact Filters: Search + Subject Dropdown + Time Dropdown */}
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-48">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-2 sm:py-1.5 rounded-lg bg-zinc-50 dark:bg-[#202020] border border-zinc-200 dark:border-zinc-750 text-xs placeholder-zinc-400 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 shadow-2xs transition-shadow min-h-[36px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-2.5 flex items-center text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Compact Subject Filter Dropdown */}
            {uniqueCourses.length > 0 && (
              <select
                value={selectedCourse ?? ""}
                onChange={(e) => setSelectedCourse(e.target.value ? e.target.value : null)}
                className="flex-1 sm:flex-initial px-2.5 py-2 sm:py-1.5 rounded-lg bg-zinc-50 dark:bg-[#202020] border border-zinc-200 dark:border-zinc-750 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-2xs cursor-pointer truncate min-h-[36px] touch-manipulation"
                aria-label="Filter by subject"
              >
                <option value="">All Subjects ({stats.total})</option>
                {uniqueCourses.map((course) => {
                  const count = courseCounts.get(course) || 0;
                  return (
                    <option key={course} value={course}>
                      {course} ({count})
                    </option>
                  );
                })}
              </select>
            )}

            {/* Time Filter Select */}
            {viewMode !== "calendar" && (
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="flex-1 sm:flex-initial px-2.5 py-2 sm:py-1.5 rounded-lg bg-zinc-50 dark:bg-[#202020] border border-zinc-200 dark:border-zinc-750 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-2xs cursor-pointer min-h-[36px] touch-manipulation"
              >
                <option value="upcoming">Upcoming & Today</option>
                <option value="this-week">Due This Week</option>
                <option value="past">Past Deadlines</option>
                <option value="all">All Deadlines</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Indicator (Clean single pill only when a course is chosen) */}
      {selectedCourse && (
        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-0.5">
          <span>Filtered by:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium border border-zinc-200 dark:border-zinc-700">
            <span>📚 {selectedCourse}</span>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 transition-colors ml-0.5"
              title="Clear subject filter"
            >
              ✕
            </button>
          </span>
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline"
          >
            Reset
          </button>
        </div>
      )}

      {/* Main View Area */}
      {viewMode === "calendar" && (
        <CalendarView tasks={calendarTasks} onTaskClick={setSelectedTask} />
      )}
      {viewMode === "grid" && (
        <TaskList tasks={filteredTasks} onTaskClick={setSelectedTask} />
      )}
      {viewMode === "timeline" && (
        <TimelineView tasks={filteredTasks} onTaskClick={setSelectedTask} />
      )}

      {/* Notion Side Peek sliding from the right */}
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}