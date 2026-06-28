import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, Award, Zap, BookOpen, CheckCircle, Flame } from "lucide-react";
import { Recommendation, Task, Goal, Habit } from "../types";

interface AiRecommendationsProps {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  completedPercentage: number;
}

const loadingTexts = [
  "Summoning the DeadlineGenie...",
  "Analyzing priorities & active tasks...",
  "Formulating the perfect focus block schedule...",
  "Gathering wisdom for your daily goals...",
  "Consulting the productivity stars...",
  "Optimizing your study & workflow flow..."
];

export default function AiRecommendations({ tasks, goals, habits, completedPercentage }: AiRecommendationsProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Set up rotating loader phrases
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTextIdx((prev) => (prev + 1) % loadingTexts.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle local state reset for the challenge completed when the recommendation changes
  useEffect(() => {
    setChallengeCompleted(false);
  }, [recommendation]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, goals, habits, completedPercentage }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Could not reach the recommendation API.");
      }
      const data = await res.json();
      setRecommendation(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically fetch recommendations once on mount to make the feature active on load
  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div id="ai-recommendations-container" className="p-5 rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50/30 via-white to-violet-50/20 shadow-xs relative overflow-hidden">
      {/* Visual background sparkles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5">
              Genie AI Advice
            </h3>
            <p className="text-xs text-gray-500">Intelligent workload & flow recommendations</p>
          </div>
        </div>

        <button
          id="get-recommendations-btn"
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-xl shadow-xs transition cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Ask DeadlineGenie
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            id="recommendations-loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-3"
          >
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <motion.p
              key={loadingTextIdx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-gray-500 max-w-xs"
            >
              {loadingTexts[loadingTextIdx]}
            </motion.p>
          </motion.div>
        )}

        {!isLoading && error && (
          <motion.div
            id="recommendations-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl border border-red-100 bg-red-50/50 text-red-700 text-sm flex items-center gap-2"
          >
            <span className="font-semibold">Oops!</span> {error}
          </motion.div>
        )}

        {!isLoading && !error && !recommendation && (
          <motion.div
            id="recommendations-placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center border border-dashed border-indigo-100 rounded-xl bg-white/50"
          >
            <p className="text-sm text-indigo-900/60 font-medium">Need direction or a productivity boost?</p>
            <p className="text-xs text-indigo-900/40 mt-1 max-w-xs mx-auto">
              Click &quot;Ask DeadlineGenie&quot; to get custom focus suggestions based on your tasks, priority items, habits, and goals!
            </p>
          </motion.div>
        )}

        {!isLoading && !error && recommendation && (
          <motion.div
            id="recommendations-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 text-left"
          >
            {/* Demo Notice Banner */}
            {recommendation.isDemo && (
              <div className="text-[11px] leading-tight text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
                ⚠️ **Demo Mode**: {recommendation.motivationalMessage}
              </div>
            )}

            {/* Motivational message from coach */}
            {!recommendation.isDemo && (
              <div className="bg-white p-3.5 rounded-xl border border-indigo-50/60 relative">
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  &ldquo;{recommendation.motivationalMessage}&rdquo;
                </p>
                <span className="absolute -top-2 -left-2 text-xl">✨</span>
              </div>
            )}

            {/* Focus Plan Blocks */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indigo-500" /> Genie Focus Order
              </h4>
              <div className="space-y-2.5">
                {recommendation.focusPlan.map((item, idx) => (
                  <div
                    key={idx}
                    id={`focus-plan-item-${idx}`}
                    className="p-3 rounded-xl border border-gray-100 bg-white shadow-2xs hover:border-indigo-100 transition duration-200"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="text-sm font-semibold text-gray-800 leading-tight">
                        {idx + 1}. {item.task}
                      </h5>
                      <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full shrink-0">
                        {item.suggestedDuration}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Tips */}
            {recommendation.tips && recommendation.tips.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-violet-500" /> Productivity Tips
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-gray-600 leading-relaxed">
                  {recommendation.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Daily Mini Challenge */}
            <div className="border border-indigo-100 bg-indigo-50/30 p-3.5 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" /> Active Mini Challenge
                </h4>
                {challengeCompleted && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    Completed! 🎉
                  </span>
                )}
              </div>
              <div className="flex items-start gap-2.5">
                <button
                  id="challenge-checkbox"
                  type="button"
                  onClick={() => setChallengeCompleted(!challengeCompleted)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                    challengeCompleted
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-indigo-300 bg-white hover:border-indigo-600"
                  }`}
                >
                  {challengeCompleted && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
                <p className={`text-xs leading-relaxed ${challengeCompleted ? "line-through text-gray-400" : "text-indigo-900/80 font-medium"}`}>
                  {recommendation.microChallenge}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
