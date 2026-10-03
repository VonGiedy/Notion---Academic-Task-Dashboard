import { Task } from "../../types/task";
import { TaskCard } from "./TaskCard";
import { formatCalendarDate } from "../../utils/dates";

export function TimelineView({
  tasks,
  onTaskClick,
}: {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}) {
  const todayStr = formatCalendarDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatCalendarDate(tomorrow);

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!task.deadline) {
      if (!acc["No Due Date"]) acc["No Due Date"] = [];
      acc["No Due Date"].push(task);
      return acc;
    }

    const dateKey = formatCalendarDate(task.deadline);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    if (a === "No Due Date") return 1;
    if (b === "No Due Date") return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-lg mb-2.5 dark:bg-zinc-800 dark:text-zinc-300">
          📅
        </div>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          No deadlines found
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          No scheduled assignments match the current criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => {
        const isToday = date === todayStr;
        const isTomorrow = date === tomorrowStr;
        const count = groupedTasks[date].length;

        return (
          <div key={date} className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {date}
                </span>

                {isToday && (
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-amber-100 text-amber-800 rounded-full dark:bg-amber-950/60 dark:text-amber-300">
                    Today
                  </span>
                )}

                {isTomorrow && (
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-orange-100 text-orange-800 rounded-full dark:bg-orange-950/60 dark:text-orange-300">
                    Tomorrow
                  </span>
                )}

                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  ({count} {count === 1 ? "task" : "tasks"})
                </span>
              </div>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {groupedTasks[date].map((task) => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
