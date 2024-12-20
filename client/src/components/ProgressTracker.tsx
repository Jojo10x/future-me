import React from "react";
import { Sparkles, Trophy } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  description: string;
  year: number;
  is_completed: boolean;
}

interface GoalProgressTrackerProps {
  goals: Goal[];
}

const GoalProgressTracker = ({ goals }: GoalProgressTrackerProps) => {
  const calculateProgress = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => goal.is_completed).length;
    if (totalGoals === 0) return 0;
    return Math.round((completedGoals / totalGoals) * 100);
  };

  const progress = calculateProgress();

  const getProgressText = () => {
    if (progress === 100) return "All goals completed! 🎉";
    if (progress >= 90) return "So close! Just a little more! 🏁";
    if (progress >= 75) return "You're almost there! Keep going! 💪";
    if (progress >= 60) return "Awesome job! Keep up the momentum! 🎯";
    if (progress >= 50) return "Great progress! Halfway done! 🔥";
    if (progress >= 40) return "Making steady progress! Keep at it! 💥";
    if (progress >= 25) return "Good start! Stay focused! 📈";
    if (progress >= 10) return "Off to a solid start, keep moving forward! 🌟";
    if (progress > 0) return "Just getting started, keep pushing! 🚀";
    return "No goals completed yet, time to take action! ⏳";
  };

  const getProgressColor = () => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 30) return "bg-yellow-500";
    return "bg-slate-500";
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      <div className="flex justify-center mb-4">
        <div className="text-center">
          <p className="text-xs text-slate-600">
            {goals.filter((goal) => goal.is_completed).length} of {goals.length}{" "}
            goals completed
          </p>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="w-full bg-slate-100 rounded-full h-3 sm:h-4">
          <div
            className={`${getProgressColor()} h-full rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 flex justify-center items-center text-white text-xs font-medium">
              {progress}%
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md 
          ${
            progress === 100
              ? "bg-green-50 text-green-700"
              : "bg-slate-50 text-slate-700"
          }
          transition-all duration-300 transform`}
        >
          {progress === 100 ? (
            <Trophy className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{getProgressText()}</span>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressTracker;
