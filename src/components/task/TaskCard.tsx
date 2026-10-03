import { Task } from "../../types/task";
import { CourseBadge } from "./CourseBadge";
import { getDeadlineInfo } from "../../utils/dates";

export function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick?: (task: Task) => void;
}) {
  const deadlineInfo = getDeadlineInfo(task.deadline);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(task)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(task);
        }
      }}
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1f1f1f] border border-zinc-200/90 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.99] transition-all duration-150 cursor-pointer text-left touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="space-y-3">
        {/* Top bar with Course badge */}
        <div className="flex items-center justify-between gap-2">
          <CourseBadge course={task.course} />
        </div>

        {/* Task Title */}
        <h3 className="font-semibold text-[15px] leading-snug tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {task.title}
        </h3>

        {/* Description snippet */}
        {task.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer with deadline status pill */}
      {deadlineInfo && (
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-[5px] border font-medium ${deadlineInfo.badgeClass}`}
          >
            {deadlineInfo.text}
          </span>
          <span className="text-[11px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Open side peek →
          </span>
        </div>
      )}
    </div>
  );
}