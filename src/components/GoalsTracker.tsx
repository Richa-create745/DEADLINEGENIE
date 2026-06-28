import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Target, Check, Calendar } from "lucide-react";
import { Goal } from "../types";

interface GoalsTrackerProps {
  goals: Goal[];
  onAddGoal: (title: string, date?: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export default function GoalsTracker({ goals, onAddGoal, onToggleGoal, onDeleteGoal }: GoalsTrackerProps) {
  const [newGoal, setNewGoal] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    onAddGoal(newGoal.trim(), targetDate || undefined);
    setNewGoal("");
    setTargetDate("");
    setIsAdding(false);
  };

  return (
    <div id="goals-tracker-container" className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Your Goals</h3>
            <p className="text-xs text-gray-400">Long-term aspirations</p>
          </div>
        </div>
        
        <button
          id="toggle-add-goal-btn"
          onClick={() => setIsAdding(!isAdding)}
          className={`p-1.5 rounded-lg border transition-all duration-200 ${
            isAdding 
              ? "bg-gray-100 text-gray-600 border-gray-200" 
              : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            id="add-goal-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="mb-4 overflow-hidden border-b border-gray-100 pb-4"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Goal Title
                </label>
                <input
                  id="goal-title-input"
                  type="text"
                  placeholder="e.g., Read 12 books, Pass certification..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Target Date (Optional)
                </label>
                <input
                  id="goal-target-date-input"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  id="submit-goal-btn"
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition"
                >
                  Save Goal
                </button>
                <button
                  id="cancel-goal-btn"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 px-3 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div id="goals-list" className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
        {goals.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-100 rounded-xl">
            <p className="text-sm text-gray-400">No goals added yet</p>
            <p className="text-xs text-gray-300 mt-1">Add one to keep yourself focused!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                id={`goal-item-${goal.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`p-3 rounded-xl border flex items-center justify-between transition group ${
                  goal.completed 
                    ? "bg-emerald-50/20 border-emerald-50 text-gray-400" 
                    : "bg-gray-50/50 border-gray-100 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <button
                    id={`toggle-goal-${goal.id}`}
                    type="button"
                    onClick={() => onToggleGoal(goal.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                      goal.completed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-gray-300 bg-white hover:border-emerald-500"
                    }`}
                  >
                    {goal.completed && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium leading-tight ${goal.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {goal.title}
                    </p>
                    {goal.targetDate && (
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Target: {goal.targetDate}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  id={`delete-goal-${goal.id}`}
                  onClick={() => onDeleteGoal(goal.id)}
                  className="text-gray-300 hover:text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shrink-0"
                  title="Delete goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
