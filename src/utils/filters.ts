import { Task } from "../types/task";

export type TimeFilter = "upcoming" | "this-week" | "past" | "all";

export function filterTasks(
  tasks: Task[],
  selectedCourse: string | null,
  searchQuery: string,
  timeFilter: TimeFilter
): Task[] {
  const query = searchQuery.trim().toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    // Course filter
    if (selectedCourse && task.course !== selectedCourse) {
      return false;
    }

    // Search query filter (matches title, description, or course name)
    if (query) {
      const titleMatch = task.title.toLowerCase().includes(query);
      const descMatch = task.description.toLowerCase().includes(query);
      const courseMatch = task.course?.toLowerCase().includes(query) ?? false;
      if (!titleMatch && !descMatch && !courseMatch) return false;
    }

    // Time filter
    if (timeFilter !== "all") {
      if (!task.deadline) {
        return timeFilter === "upcoming" || timeFilter === "this-week";
      }

      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);

      if (timeFilter === "upcoming") {
        return taskDate.getTime() >= today.getTime();
      } else if (timeFilter === "this-week") {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return (
          taskDate.getTime() >= today.getTime() &&
          taskDate.getTime() <= nextWeek.getTime()
        );
      } else if (timeFilter === "past") {
        return taskDate.getTime() < today.getTime();
      }
    }

    return true;
  });
}
