import React, { useState } from "react";
import { CheckCircle, ChevronDown, Trophy } from "lucide-react";
import { Goal } from "@/types/types";
import { SubTaskList } from "@/components/SubTask/SubTaskList";
import { Undo2, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from "./ConfirmDialog";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      setShowCompletionEffect(true);
      await onComplete();
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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const createdDate = goal.created_at.split("T")[0];
  const updatedDate = goal.updated_at.split("T")[0];
  const completedDate = goal.completed_at ? goal.completed_at.split("T")[0] : "";
  const currentYear = new Date().getFullYear();
  const isOverdue = !goal.is_completed && goal.year < currentYear;


  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-500
  ${goal.is_completed
          ? "bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 border-2 border-emerald-200"
          : isOverdue
            ? "bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-300"
            : "bg-white border-2 border-slate-200"
        }
  hover:shadow-2xl hover:scale-[1.02] transform
  ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
    >
      {showCompletionEffect && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-emerald-400/20 to-teal-400/20" />
          <div className="absolute top-4 left-10 animate-bounce">
            <Trophy className="w-40 h-40 text-yellow-400 drop-shadow-lg" />
          </div>
        </div>
      )}

      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <h3
                  className={`text-lg lg:text-xl font-semibold tracking-tight transition-all duration-300
  ${goal.is_completed
                      ? "text-emerald-700 line-through decoration-2 decoration-emerald-400"
                      : isOverdue
                        ? "text-red-700"
                        : "text-slate-900"
                    }`}
                >
                  {goal.title}
                </h3>
              </div>
            </div>
            <span className="py-1 text-xs lg:text-sm font-medium text-slate-500 transition-all duration-300">
              Created: {createdDate}{" "}
              {createdDate !== updatedDate && ` • Updated: ${updatedDate}`}
            </span>
            <span className="flex justify-center text-l">
              {goal.is_completed && `Completed: ${completedDate}`}
              {isOverdue && !goal.is_completed && (
                <span className="text-red-600 font-semibold">
                  ⚠️ Overdue since {goal.year}
                </span>
              )}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full transition-all duration-300 hover:scale-110 text-slate-400"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            <ChevronDown
              className={`w-7 h-7 transition-transform duration-300 hover:scale-125 
                ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div
          className={`space-y-4 transition-all duration-500
          ${isExpanded
              ? "opacity-100 max-h-96"
              : "opacity-0 max-h-0 overflow-hidden"
            }`}
        >
          {goal.description ? (
            <p
              className={`leading-relaxed transition-colors duration-300
              ${goal.is_completed ? "text-emerald-600" : "text-slate-600"}`}
            >
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

        <div className="flex items-center justify-end gap-5 pt-4 border-t border-slate-200">
          <span
            className={`mr-auto px-2 lg:px-3 py-1 text-sm font-medium rounded-full
   transition-all duration-300 animate-fade-in
    ${goal.is_completed
                ? "bg-emerald-100 text-emerald-700"
                : isOverdue
                  ? "bg-red-100 text-red-700 ring-2 ring-red-300"
                  : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
              }`}
          >
            {goal.year}
          </span>
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="p-2 text-gray-600 transition-all duration-300 hover:scale-125 disabled:opacity-50 "
            aria-label={goal.is_completed ? "Uncomplete" : "Complete"}
          >
            {goal.is_completed ? (
              <Undo2
                className="w-6 h-6 transform inline-block transition-transform"
                color="blue"
              />
            ) : (
              <CheckCircle
                className="w-6 h-6 transform inline-block transition-transform"
                color="green"
              />
            )}
          </button>

          <button
            onClick={onEdit}
            disabled={isLoading}
            className="p-2 text-gray-600 transition-all duration-300 hover:scale-125 disabled:opacity-50"
            aria-label="Edit"
          >
            <Pencil className="w-6 h-6 transform inline-block transition-transform" />
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="p-2 text-gray-600 transition-all duration-300 hover:scale-125 disabled:opacity-50 hover:text-red-100"
            aria-label="Delete"
          >
            <Trash2
              className="w-6 h-6 transform inline-block transition-transform"
              color="red"
            />
          </button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default GoalItem;
