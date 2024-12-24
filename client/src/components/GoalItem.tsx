import { CheckCircle2, Edit2, Trash2 } from "lucide-react";
import { Goal } from "@/types/types";
import { SubTaskList } from "./SubTaskList";
import { useState } from 'react';

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

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      await onComplete();
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
      className={`p-6 rounded-xl transition-all duration-300
        ${
          goal.is_completed
            ? "bg-slate-50 border border-slate-200"
            : "bg-white border border-slate-200"
        }
        hover:shadow-md
        ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3
            className={`text-xl font-medium text-slate-800
              ${goal.is_completed ? "line-through text-slate-500" : ""}`}
          >
            {goal.title}
          </h3>
          <span className="px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-600">
            {goal.year}
          </span>
        </div>
        
        {goal.description ? (
          <p className="text-slate-600">{goal.description}</p>
        ) : (
          <SubTaskList
            subtasks={goal.subtasks}
            onComplete={handleSubtaskComplete}
            goalId={goal.id}
          />
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors
              ${
                goal.is_completed
                  ? "text-teal-600 hover:bg-teal-50"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{goal.is_completed ? "Completed" : "Complete"}</span>
          </button>

          <button
            onClick={onEdit}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-slate-600
              hover:bg-slate-50 rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-slate-600
              hover:bg-slate-50 rounded-md transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalItem;