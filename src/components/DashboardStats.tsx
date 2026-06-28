import { motion } from "motion/react";
import { ListTodo, AlertCircle, Target, Flame, CheckCircle2 } from "lucide-react";
import { Task, Goal, Habit } from "../types";

interface DashboardStatsProps {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
}

export default function DashboardStats({ tasks, goals, habits }: DashboardStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const highPriorityTasks = tasks.filter((t) => !t.completed && t.priority === "High").length;
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.completed).length;
  
  // Calculate average habit streak or active habits
  const activeHabits = habits.length;
  const completedHabitsToday = habits.filter((h) => h.completedToday).length;

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      id: "stat-total-tasks",
      title: "Total Tasks",
      value: totalTasks,
      subtitle: `${completedTasks} completed`,
      icon: ListTodo,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      id: "stat-high-priority",
      title: "High Priority",
      value: highPriorityTasks,
      subtitle: "Pending action",
      icon: AlertCircle,
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      id: "stat-total-goals",
      title: "Goals Tracked",
      value: totalGoals,
      subtitle: `${completedGoals} reached`,
      icon: Target,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      id: "stat-total-habits",
      title: "Daily Habits",
      value: activeHabits,
      subtitle: `${completedHabitsToday} completed today`,
      icon: Flame,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div id="dashboard-stats-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            id={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={`p-4 rounded-2xl border bg-white flex items-center justify-between shadow-xs hover:shadow-md transition-shadow duration-300`}
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{stat.subtitle}</p>
            </div>
            <div className={`p-3 rounded-xl border ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </motion.div>
        );
      })}

      {/* Progress Bar Row */}
      <motion.div
        id="completion-progress-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="col-span-1 sm:col-span-2 lg:col-span-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h4 className="font-semibold text-gray-800">Overall Task Progress</h4>
          </div>
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {progressPercentage}% Completed
          </span>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
