import React from "react";
import { CheckCircle2, Edit2, Trash2 } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  description: string;
  year: number;
  is_completed: boolean;
}

const GoalItem = ({
  goal,
  onDelete,
  onComplete,
  onEdit,
}: {
  goal: Goal;
  onDelete: () => void;
  onComplete: () => void;
  onEdit: () => void;
}) => {
  return (
    <div
      className={`p-6 rounded-xl transition-all duration-300 
      ${
        goal.is_completed
          ? "bg-slate-50 border border-slate-200"
          : "bg-white border border-slate-200"
      } 
      hover:shadow-md`}
    >
      {/* Main Content */}
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

        <p className="text-slate-600">{goal.description}</p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onComplete}
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
            className="flex items-center gap-2 px-3 py-1.5 text-slate-600 
              hover:bg-slate-50 rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={onDelete}
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
