import { Task } from "../../types/task";
import { TaskCard } from "./TaskCard";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl border-gray-300 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No academic tasks found.</p>
        <p className="text-sm text-gray-400 mt-1">Enjoy your free time!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}