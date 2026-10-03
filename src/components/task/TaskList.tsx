import { Task } from "../../types/task";
import { TaskCard } from "./TaskCard";

export function TaskList({
  tasks,
  onTaskClick,
}: {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-lg mb-2.5 dark:bg-zinc-800 dark:text-zinc-300">
          🎉
        </div>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          All caught up!
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
          No assignments found matching this filter. Enjoy your break or check another subject!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
      ))}
    </div>
  );
}