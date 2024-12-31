import React, { useState } from 'react';
import { Target, AlertCircle } from 'lucide-react';
import { Goal, NewGoal } from "@/types/types";

interface GoalTitleInputProps {
  goal: Goal | Partial<NewGoal>;
  handleChange: <K extends keyof (Goal | NewGoal)>(field: K, value: (Goal | NewGoal)[K]) => void;
}

export const GoalTitleInput: React.FC<GoalTitleInputProps> = ({ 
  goal, 
  handleChange 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const MAX_LENGTH = 20;

  const handleTitleChange = (value: string) => {
    if (value.length <= MAX_LENGTH) {
      handleChange("title", value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label 
          htmlFor="goal-title"
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          <Target className="w-4 h-4" />
          <span>Goal Title</span>
        </label>
        <span className="text-xs text-slate-400">
          {(goal.title?.length || 0)}/{MAX_LENGTH}
        </span>
      </div>

      <div className={`relative rounded-lg transition-all duration-300
        ${isFocused ? 'ring-2 ring-blue-100 ring-offset-2' : 'ring-1 ring-slate-200'}`}
      >
        <input
          id="goal-title"
          type="text"
          value={goal.title || ""}
          onChange={(e) => handleTitleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="block w-full px-4 py-3 rounded-lg border-0 
            bg-white dark:bg-slate-900
            placeholder:text-slate-400 text-slate-900 dark:text-slate-100
            focus:ring-0 sm:text-sm"
          placeholder="Enter a clear and specific goal..."
          required
          maxLength={MAX_LENGTH}
        />
      </div>

      {goal.title && goal.title.length < 5 && (
        <div className="flex items-center gap-2 text-yellow-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Title should be descriptive</span>
        </div>
      )}
    </div>
  );
};