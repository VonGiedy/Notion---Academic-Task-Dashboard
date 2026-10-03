import { TaskPriority } from "../../types/task";

export function PriorityBadge({ priority }: { priority: TaskPriority | string }) {
  // ✨ Clean pastel colors with dark mode support
  const colorMap: Record<string, string> = {
    "High Priority":
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50",
    "Medium Priority":
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
    "Low Priority":
      "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50",
  };

  const colors =
    colorMap[priority] ||
    "bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${colors}`}>
      {priority}
    </span>
  );
}