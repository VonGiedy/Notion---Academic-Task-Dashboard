export interface Task {
  id: string;
  title: string;
  deadline: Date | null;
  priority: string;
  completed: boolean;
  description: string;
  course: string | null; 
}