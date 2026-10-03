import { getAcademicTasks } from "../src/services/notion.service";
import { TaskBoard } from "../src/components/task/TaskBoard";

export const revalidate = 60;

export default async function AcademicDashboard() {
  const tasks = await getAcademicTasks();

  return (
    <main className="min-h-screen bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#e6e6e5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-14 space-y-7">
        {/* Notion-style Page Header */}
        <header className="space-y-4">
          {/* Notion Page Icon */}
          <div className="text-4xl sm:text-5xl select-none">🎓</div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Class Academic Hub
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Course schedules, assignments, and shared deliverables
              </p>
            </div>

            {/* Sync Status Badge */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-[#202020] px-3 py-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 shadow-2xs self-start sm:self-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Synced with Notion</span>
            </div>
          </div>

          {/* Notion-style Callout Block */}
          <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-[#f7f6f3] dark:bg-[#202020] border border-zinc-200/60 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            <span className="text-base select-none">💡</span>
            <div className="leading-relaxed">
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                Classmate Notice:
              </strong>{" "}
              Click on any assignment card in the calendar or board to open the{" "}
              <strong>Side Peek</strong> and read detailed instructions and rubric notes.
            </div>
          </div>
        </header>

        {/* Database Task Board */}
        <TaskBoard tasks={tasks} />
      </div>
    </main>
  );
}