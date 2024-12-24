import React, { useState } from 'react';
import { CheckCircle2, Edit2, Trash2, ChevronDown, Trophy } from "lucide-react";
import { Goal } from "@/types/types";
import { SubTaskList } from "./SubTaskList";

interface GoalItemProps {
  goal: Goal;
  onDelete: () => void;
  onComplete: () => void;
  onEdit: () => void;
  onSubtaskComplete: (subtaskId: number) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onDelete,
  onComplete,
  onEdit,
  onSubtaskComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      setShowCompletionEffect(true);
      await onComplete();
      // Reset the completion effect after animation
      setTimeout(() => setShowCompletionEffect(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubtaskComplete = async (subtaskId: number) => {
    try {
      setIsLoading(true);
      await onSubtaskComplete(subtaskId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500
        ${goal.is_completed 
          ? "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200"
          : "bg-gradient-to-br from-white to-slate-50 border border-slate-200"
        }
        hover:shadow-xl hover:scale-[1.02] transform
        ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
    >
      {showCompletionEffect && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-emerald-400/20 to-teal-400/20" />
          <div className="absolute top-4 left-10 animate-bounce">
            <Trophy className="w-40 h-40 text-yellow-400" />
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <div className="relative">           
                <h3
                  className={`text-xl font-semibold tracking-tight transition-all duration-300
                    ${goal.is_completed 
                      ? "text-emerald-700 line-through decoration-2 decoration-emerald-400" 
                      : "text-slate-900"
                    }`}
                >
                  {goal.title}
                </h3>
              
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full
                transition-all duration-300
                ${goal.is_completed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                }`}>
                {goal.year}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-full transition-all duration-300
              ${goal.is_completed
                ? "text-emerald-600 hover:bg-emerald-100"
                : "text-slate-400 hover:bg-slate-100"
              }`}
          >
            <ChevronDown 
              className={`w-5 h-5 transition-transform duration-300 
                ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        
        <div className={`space-y-4 transition-all duration-300
          ${isExpanded 
            ? "opacity-100 max-h-96" 
            : "opacity-0 max-h-0 overflow-hidden"}`}>
          {goal.description ? (
            <p className={`leading-relaxed transition-colors duration-300
              ${goal.is_completed ? "text-emerald-600" : "text-slate-600"}`}>
              {goal.description}
            </p>
          ) : (
            <SubTaskList
              subtasks={goal.subtasks}
              onComplete={handleSubtaskComplete}
              goalId={goal.id}
            />
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
              transition-all duration-300 relative overflow-hidden
              ${goal.is_completed
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
          >
            <CheckCircle2 className={`w-4 h-4 transition-transform duration-300
              ${goal.is_completed ? "scale-110" : ""}`} />
            <span>{goal.is_completed ? "Completed" : "Complete"}</span>
          </button>

          <button
            onClick={onEdit}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              transition-all duration-300
              ${goal.is_completed
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              text-red-600 hover:bg-red-50 transition-all duration-300 ml-auto
              group/delete"
          >
            <Trash2 className="w-4 h-4 transition-transform duration-300
              group-hover/delete:rotate-12" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalItem;

