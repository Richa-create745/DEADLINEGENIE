import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Search, Calendar, Filter, Book, Briefcase, User, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Task, Category, Priority } from "../types";

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (title: string, category: Category, priority: Priority, deadline: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const categories: { name: Category; emoji: string; color: string }[] = [
  { name: "Study", emoji: "📚", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { name: "Work", emoji: "💼", color: "bg-purple-50 text-purple-700 border-purple-100" },
  { name: "Personal", emoji: "🏠", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { name: "Health", emoji: "🏃", color: "bg-rose-50 text-rose-700 border-rose-100" },
];

const priorities: Priority[] = ["High", "Medium", "Low"];

export default function TaskManager({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskManagerProps) {
  // Task form state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Study");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [deadline, setDeadline] = useState("");

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All"); // All, Pending, Completed

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;
    onAddTask(title.trim(), category, priority, deadline);
    setTitle("");
    setDeadline("");
    setIsAdding(false);
  };

  // Days remaining calculation helper
  const getDaysRemainingText = (deadlineStr: string, completed: boolean) => {
    if (completed) return { text: "Completed", color: "text-gray-400 bg-gray-50 border-gray-100" };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(deadlineStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, color: "text-rose-600 bg-rose-50 border-rose-100 font-bold animate-pulse" };
    } else if (diffDays === 0) {
      return { text: "Due Today 🔔", color: "text-amber-600 bg-amber-50 border-amber-100 font-bold" };
    } else if (diffDays === 1) {
      return { text: "1 day left ⚠️", color: "text-indigo-600 bg-indigo-50 border-indigo-100" };
    } else {
      return { text: `${diffDays} days left`, color: "text-gray-500 bg-gray-50 border-gray-100" };
    }
  };

  // Get category icon helper
  const getCategoryDetails = (cat: Category) => {
    return categories.find((c) => c.name === cat) || { emoji: "📋", color: "bg-gray-50 text-gray-700" };
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;
    const matchesPriority = selectedPriority === "All" || task.priority === selectedPriority;
    
    let matchesStatus = true;
    if (selectedStatus === "Pending") matchesStatus = !task.completed;
    if (selectedStatus === "Completed") matchesStatus = task.completed;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Count active/pending tasks for visual counters
  const totalFilteredCount = filteredTasks.length;

  return (
    <div id="task-manager-container" className="space-y-4">
      {/* Search and Filters panel */}
      <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Your Tasks</h3>
          <button
            id="toggle-add-task-btn"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            {isAdding ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Close Add Form" : "Add Task"}
          </button>
        </div>

        {/* Dynamic add form */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              id="add-task-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleAddTaskSubmit}
              className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3 overflow-hidden"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Task Title
                </label>
                <input
                  id="task-title-input"
                  type="text"
                  required
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    id="task-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    id="task-priority-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p} Priority
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadline selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Deadline Date
                  </label>
                  <input
                    id="task-deadline-input"
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                id="submit-task-btn"
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl shadow-xs transition text-xs uppercase tracking-wider cursor-pointer"
              >
                Create Task ✨
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            id="task-search-input"
            type="text"
            placeholder="Search tasks instantly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
          />
        </div>

        {/* Filters Selectors Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Status filter */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              id="filter-status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-2 py-1.5 border border-gray-150 rounded-lg bg-gray-50/30 text-gray-600 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              id="filter-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-2 py-1.5 border border-gray-150 rounded-lg bg-gray-50/30 text-gray-600 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Study">📚 Study</option>
              <option value="Work">💼 Work</option>
              <option value="Personal">🏠 Personal</option>
              <option value="Health">🏃 Health</option>
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              id="filter-priority-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-xs px-2 py-1.5 border border-gray-150 rounded-lg bg-gray-50/30 text-gray-600 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List container */}
      <div id="tasks-list" className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
            <p className="text-sm text-gray-400 font-medium">No tasks match your filters</p>
            <p className="text-xs text-gray-300 mt-1">Try resetting search or filters, or create a task!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredTasks.map((task) => {
              const catDetails = getCategoryDetails(task.category);
              const daysRem = getDaysRemainingText(task.deadline, task.completed);
              
              // Priority badge style
              const priorityColors = 
                task.priority === "High" ? "bg-red-50 text-red-700 border-red-100" :
                task.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
                "bg-emerald-50 text-emerald-700 border-emerald-100";

              return (
                <motion.div
                  key={task.id}
                  id={`task-item-${task.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-2xl border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-2xs hover:shadow-xs group ${
                    task.completed ? "opacity-75 bg-gray-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Custom circular checkbox */}
                    <button
                      id={`toggle-task-${task.id}`}
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className={`mt-1.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition cursor-pointer ${
                        task.completed
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-gray-300 bg-white hover:border-indigo-600"
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    <div className="min-w-0">
                      <p className={`font-semibold text-gray-800 leading-snug break-words ${task.completed ? "line-through text-gray-400" : ""}`}>
                        {task.title}
                      </p>
                      
                      {/* Meta information indicators row */}
                      <div className="flex flex-wrap gap-1.5 mt-2 items-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catDetails.color}`}>
                          {catDetails.emoji} {task.category}
                        </span>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityColors}`}>
                          {task.priority} Priority
                        </span>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${daysRem.color} flex items-center gap-1`}>
                          <Calendar className="w-2.5 h-2.5" /> {daysRem.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end shrink-0">
                    <button
                      id={`delete-task-${task.id}`}
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 text-gray-300 hover:text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
