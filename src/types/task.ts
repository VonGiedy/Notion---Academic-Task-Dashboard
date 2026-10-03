export type TaskPriority =
  | "High Priority"
  | "Medium Priority"
  | "Low Priority"
  | "No Priority";

export interface Task {
  id: string;
  title: string;
  deadline: Date | null;
  priority: TaskPriority | string;
  completed: boolean;
  description: string;
  course: string | null;
}