"use client";

import { useState } from "react";
import { Task } from "../../types/task";
import { TaskList } from "./TaskList";
import { CalendarView } from "./CalendarView";

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  
 
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">("upcoming");

  const uniqueCourses = Array.from(
    new Set(tasks.map((task) => task.course).filter(Boolean))
  ) as string[];

  const filteredTasks = tasks.filter((task) => {
  
    const matchesCourse = selectedCourse ? task.course === selectedCourse : true;
    

    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
   
    let matchesTime = true;
    if (timeFilter !== "all") {
      if (!task.deadline) {

        matchesTime = timeFilter === "upcoming";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(task.deadline);
        taskDate.setHours(0, 0, 0, 0);

        if (timeFilter === "upcoming") {
          matchesTime = taskDate.getTime() >= today.getTime(); 
        } else if (timeFilter === "past") {
          matchesTime = taskDate.getTime() < today.getTime();
        }
      }
    }
      
    return matchesCourse && matchesSearch && matchesTime;
  });

  return (
    <div className="space-y-8">
      
    
      <div className="relative z-10 flex flex-col md:flex-row gap-4 px-2 justify-between items-start md:items-center">
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-2xl">
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search in tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-2.5 border-none rounded-full bg-white shadow-sm text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow dark:bg-slate-900 dark:text-white dark:focus:ring-slate-300"
            />
          </div>

          {/* ⏱ate Filter Dropdown */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as "upcoming" | "past" | "all")}
            className="block w-full sm:w-48 px-4 py-2.5 border-none rounded-full bg-white shadow-sm text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow dark:bg-slate-900 dark:text-slate-300 dark:focus:ring-slate-300 cursor-pointer"
          >
            <option value="upcoming">Upcoming & Today</option>
            <option value="past">Previous Tasks</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex p-1 bg-white shadow-sm rounded-full dark:bg-slate-900 w-full sm:w-auto shrink-0 justify-center">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all active:scale-95 w-1/2 sm:w-auto ${
              viewMode === "grid" ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all active:scale-95 w-1/2 sm:w-auto ${
              viewMode === "calendar" ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Executive Filter Chips */}
      {uniqueCourses.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-2 px-2">
          <button
            onClick={() => setSelectedCourse(null)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
              selectedCourse === null
                ? "bg-slate-800 text-white border-transparent dark:bg-slate-200 dark:text-slate-900"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
            }`}
          >
            All classes
          </button>
          
          {uniqueCourses.map((course) => (
            <button
              key={course}
              onClick={() => setSelectedCourse(course)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                selectedCourse === course
                  ? "bg-slate-800 text-white border-transparent dark:bg-slate-200 dark:text-slate-900"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
              }`}
            >
              {course}
            </button>
          ))}
        </div>
      )}

      {viewMode === "grid" ? <TaskList tasks={filteredTasks} /> : <CalendarView tasks={filteredTasks} />}
    </div>
  );
}