import { Task } from "../../types/task";
import { PriorityBadge } from "./PriorityBadge";
import { CourseBadge } from "./CourseBadge";

export function TaskCard({ task }: { task: Task }) {
  const isOverdue = task.deadline && task.deadline < new Date() && !task.completed;

  return (
    <div className="group flex flex-col gap-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-[17px] leading-tight mt-0.5 text-black">
          {task.title}
        </h3>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer*/}
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
        <CourseBadge course={task.course} />
        <PriorityBadge priority={task.priority} />
        
        {task.deadline && (
          <span className={`text-xs font-medium ml-auto px-2 py-1 rounded-md ${
            isOverdue 
              ? 'bg-red-50 text-red-600' 
              : 'text-gray-500'
          }`}>
            {isOverdue ? '⚠️ ' : ''}
            {task.deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}