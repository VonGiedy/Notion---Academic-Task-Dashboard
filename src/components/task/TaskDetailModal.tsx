"use client";

import { useEffect } from "react";
import { Task } from "../../types/task";
import { CourseBadge } from "./CourseBadge";
import { formatCalendarDate, getDeadlineInfo } from "../../utils/dates";

export function TaskDetailModal({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (task) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [task, onClose]);

  if (!task) return null;

  const deadlineInfo = getDeadlineInfo(task.deadline);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop - click to close */}
      <div
        className="fixed inset-0 bg-black/25 dark:bg-black/60 backdrop-blur-[1px] transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Notion Side Peek Panel sliding from the right */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-full sm:max-w-lg md:max-w-xl bg-white dark:bg-[#1c1c1c] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-side-peek overflow-y-auto">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <span>🎓 Academic Hub</span>
            <span>/</span>
            <span className="truncate max-w-[200px] text-zinc-700 dark:text-zinc-300">
              {task.course ?? "Task"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Close side peek (Esc)"
              aria-label="Close side peek"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Notion Page Icon & Title */}
          <div className="space-y-3">
            <div className="text-3xl select-none">📄</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              {task.title}
            </h1>
          </div>

          {/* Notion Property Rows */}
          <div className="space-y-2.5 pt-2 text-sm">
            {/* Course Property */}
            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                <span>📚</span> Course
              </span>
              <div>
                <CourseBadge course={task.course} />
              </div>
            </div>

            {/* Deadline Property */}
            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                <span>📅</span> Deadline
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {task.deadline ? (
                  <>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {formatCalendarDate(task.deadline)}
                    </span>
                    {deadlineInfo && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md border font-medium ${deadlineInfo.badgeClass}`}
                      >
                        {deadlineInfo.text}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-zinc-400 italic">
                    No deadline specified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Notion Divider */}
          <div className="h-px bg-zinc-200 dark:bg-zinc-800/90 my-6" />

          {/* Notion Page Content / Notes */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Details & Instructions
            </h2>
            {task.description ? (
              <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-normal">
                {task.description}
              </div>
            ) : (
              <div className="text-xs italic text-zinc-400 dark:text-zinc-500 py-4">
                No description or extra details entered for this task.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Synced from Notion
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700/60 transition-colors shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
