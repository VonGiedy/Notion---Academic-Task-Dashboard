import { getAcademicTasks } from "../src/services/notion.service";
import { TaskBoard } from "../src/components/task/TaskBoard";

export const revalidate = 60; 

export default async function AcademicDashboard() {
  const tasks = await getAcademicTasks();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-8 mt-4 md:mt-8">
        
        <header className="px-2">
          <h1 className="text-4xl font-normal tracking-tight text-slate-900 dark:text-white mb-1">
            Academic Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Synced directly from Notion
          </p>
        </header>

        <TaskBoard tasks={tasks} />
        
      </div>
    </main>
  );
}