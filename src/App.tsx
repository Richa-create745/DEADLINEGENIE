import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, LayoutDashboard, Settings, Info, Calendar, Compass, Flame, CheckCircle2 } from "lucide-react";
import { Task, Goal, Habit, Category, Priority } from "./types";
import DashboardStats from "./components/DashboardStats";
import GoalsTracker from "./components/GoalsTracker";
import HabitsTracker from "./components/HabitsTracker";
import TaskManager from "./components/TaskManager";
import AiRecommendations from "./components/AiRecommendations";

// Get today's date formatted as YYYY-MM-DD
const getTodayDateString = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
};

const defaultTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete B.Tech Hackathon Presentation 🚀",
    category: "Study",
    priority: "High",
    deadline: getTodayDateString(2),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Review DeadlineGenie source code and design 🎨",
    category: "Work",
    priority: "Medium",
    deadline: getTodayDateString(1),
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Perform 15-minute daily cardio/stretching 🏃",
    category: "Health",
    priority: "Low",
    deadline: getTodayDateString(0),
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const defaultGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Master React & TypeScript Full-Stack",
    completed: false,
    targetDate: getTodayDateString(30),
  },
  {
    id: "goal-2",
    title: "Launch DeadlineGenie on GitHub Pages",
    completed: true,
    targetDate: getTodayDateString(-2),
  },
];

const defaultHabits: Habit[] = [
  {
    id: "habit-1",
    title: "Write Clean Code Everyday 💻",
    streak: 5,
    completedToday: false,
  },
  {
    id: "habit-2",
    title: "Drink 3 Liters of Water 💧",
    streak: 3,
    completedToday: true,
  },
];

export default function App() {
  // Sync States
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("deadlinegenie_tasks");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("deadlinegenie_goals");
    return saved ? JSON.parse(saved) : defaultGoals;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("deadlinegenie_habits");
    return saved ? JSON.parse(saved) : defaultHabits;
  });

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem("deadlinegenie_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("deadlinegenie_goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("deadlinegenie_habits", JSON.stringify(habits));
  }, [habits]);

  // Task Actions
  const handleAddTask = (title: string, category: Category, priority: Priority, deadline: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      category,
      priority,
      deadline,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Goal Actions
  const handleAddGoal = (title: string, date?: string) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      completed: false,
      targetDate: date,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Habit Actions
  const handleAddHabit = (title: string) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title,
      streak: 0,
      completedToday: false,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const completed = !h.completedToday;
          return {
            ...h,
            completedToday: completed,
            streak: completed ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const completedPercentage = tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div id="app-root" className="min-h-screen bg-[#fafafa] text-gray-900 pb-12 select-none font-sans">
      {/* Visual background subtle grid / details */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  DeadlineGenie
                </h1>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                  AI Companion
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Smart Time-Management & Daily Flow Optimizer for B.Tech Hackathons & Beyond
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-white px-3 py-1.5 rounded-xl border border-gray-150/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            <span>Local Sync Active</span>
          </div>
        </header>

        {/* Dashboard Row */}
        <DashboardStats tasks={tasks} goals={goals} habits={habits} />

        {/* Bento Grid layout containing Tasks and AI Companion */}
        <div id="bento-grid-main" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center Side: Task manager (takes 7 columns in lg screens) */}
          <div className="lg:col-span-7 space-y-6">
            <TaskManager
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* Right Side: Goals & Habits & AI recommendations (takes 5 columns in lg screens) */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Companion Hub */}
            <AiRecommendations
              tasks={tasks}
              goals={goals}
              habits={habits}
              completedPercentage={completedPercentage}
            />

            {/* Goals Tracker */}
            <GoalsTracker
              goals={goals}
              onAddGoal={handleAddGoal}
              onToggleGoal={handleToggleGoal}
              onDeleteGoal={handleDeleteGoal}
            />

            {/* Daily Habits Tracker */}
            <HabitsTracker
              habits={habits}
              onAddHabit={handleAddHabit}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          </div>

        </div>

        {/* Informative Footer */}
        <footer className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-gray-400" />
            <span>DeadlineGenie app developed with premium AI enhancements. All data saved securely to client-side Local Storage.</span>
          </div>
          <div>
            <span>By Richa Sharma | B.Tech CSE Hackathon Entry</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
