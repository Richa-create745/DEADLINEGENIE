export type Priority = "High" | "Medium" | "Low";

export type Category = "Study" | "Work" | "Personal" | "Health";

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  deadline: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
  targetDate?: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
  lastCompletedDate?: string; // YYYY-MM-DD
}

export interface FocusPlanItem {
  task: string;
  reason: string;
  suggestedDuration: string;
}

export interface Recommendation {
  isDemo?: boolean;
  motivationalMessage: string;
  focusPlan: FocusPlanItem[];
  tips: string[];
  microChallenge: string;
}
