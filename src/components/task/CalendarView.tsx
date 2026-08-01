import { Task } from "../../types/task";
import { TaskCard } from "./TaskCard";

export function CalendarView({ tasks }: { tasks: Task[] }) {
 
  const groupedTasks = tasks.reduce((acc, task) => {
    
    if (!task.deadline) {
      if (!acc["No Date"]) acc["No Date"] = [];
      acc["No Date"].push(task);
      return acc;
    }

    
    const dateKey = task.deadline.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);


  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    if (a === "No Date") return 1;
    if (b === "No Date") return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl border-gray-300 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {date}
            </h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupedTasks[date].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}