import React from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Goal } from "@/types/types";

export const GoalList = ({
  goals,
  showStatus = true,
  expandedGoals,
  toggleGoalExpansion,
}: {
  goals: Goal[];
  showStatus?: boolean;
  expandedGoals: number[];
  toggleGoalExpansion: (goalId: number) => void;
}) => (
  <div className="space-y-4">
    {goals.map((goal) => {
      const isExpanded = expandedGoals.includes(goal.id);
      const completedSubtasks = goal.subtasks.filter(
        (task) => task.is_completed
      ).length;
      const totalSubtasks = goal.subtasks.length;

      return (
        <div
          key={goal.id}
          className="bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden"
        >
          <div
            className="flex items-start gap-4 p-4 cursor-pointer"
            onClick={() => toggleGoalExpansion(goal.id)}
          >
            {showStatus && (
              <div className="mt-1">
                {goal.is_completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {goal.subtasks.length > 0 && (
                  <button className="p-1 hover:bg-gray-50 rounded">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                )}
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {goal.title}
                </h3>
              </div>
              {goal.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {goal.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span>Year: {goal.year}</span>
                <span>
                  Created: {new Date(goal.created_at).toLocaleDateString()}
                </span>
                {goal.subtasks.length > 0 && (
                  <span>
                    Subtasks: {completedSubtasks}/{totalSubtasks} completed
                  </span>
                )}
              </div>
            </div>
          </div>

          {isExpanded && goal.subtasks.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50">
              <div className="p-4 space-y-2">
                {goal.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    {subtask.is_completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <span
                      className={`${
                        subtask.is_completed ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    })}
    {goals.length === 0 && (
      <div className="text-center py-8">
        <Circle className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No goals found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {showStatus
            ? "Start by creating some goals!"
            : "You haven't completed any goals yet."}
        </p>
      </div>
    )}
  </div>
);
