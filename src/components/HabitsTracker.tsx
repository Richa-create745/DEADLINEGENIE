import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Flame, Check } from "lucide-react";
import { Habit } from "../types";

interface HabitsTrackerProps {
  habits: Habit[];
  onAddHabit: (title: string) => void;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

export default function HabitsTracker({ habits, onAddHabit, onToggleHabit, onDeleteHabit }: HabitsTrackerProps) {
  const [newHabit, setNewHabit] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    onAddHabit(newHabit.trim());
    setNewHabit("");
    setIsAdding(false);
  };

  return (
    <div id="habits-tracker-container" className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Daily Habits</h3>
            <p className="text-xs text-gray-400">Build long-term streaks</p>
          </div>
        </div>

        <button
          id="toggle-add-habit-btn"
          onClick={() => setIsAdding(!isAdding)}
          className={`p-1.5 rounded-lg border transition-all duration-200 ${
            isAdding 
              ? "bg-gray-100 text-gray-600 border-gray-200" 
              : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            id="add-habit-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="mb-4 overflow-hidden border-b border-gray-100 pb-4"
          >
            <div className="flex gap-2">
              <input
                id="habit-title-input"
                type="text"
                placeholder="e.g., Code for 1hr, Read 10 pages..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <button
                id="submit-habit-btn"
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition"
              >
                Add
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div id="habits-list" className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
        {habits.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-100 rounded-xl">
            <p className="text-sm text-gray-400">No habits added yet</p>
            <p className="text-xs text-gray-300 mt-1">Start daily routines and stay consistent!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                id={`habit-item-${habit.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`p-3 rounded-xl border flex items-center justify-between transition group ${
                  habit.completedToday 
                    ? "bg-amber-50/20 border-amber-100/50 text-gray-400" 
                    : "bg-gray-50/50 border-gray-100 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    id={`toggle-habit-${habit.id}`}
                    type="button"
                    onClick={() => onToggleHabit(habit.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                      habit.completedToday
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "border-gray-300 bg-white hover:border-amber-500"
                    }`}
                  >
                    {habit.completedToday && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium leading-tight ${habit.completedToday ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {habit.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                        habit.streak > 0 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        <Flame className="w-3 h-3 fill-current" /> {habit.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  id={`delete-habit-${habit.id}`}
                  onClick={() => onDeleteHabit(habit.id)}
                  className="text-gray-300 hover:text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shrink-0"
                  title="Delete habit"
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
