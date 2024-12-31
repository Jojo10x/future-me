import React, { useState } from 'react';
import { Type, AlertCircle, CornerDownRight } from 'lucide-react';
import { Goal, NewGoal } from "@/types/types";

interface DescriptionInputProps {
  goal: Goal | Partial<NewGoal>;
  handleChange: <K extends keyof (Goal | NewGoal)>(field: K, value: (Goal | NewGoal)[K]) => void;
}

export const DescriptionInput: React.FC<DescriptionInputProps> = ({ 
  goal, 
  handleChange 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(goal.description?.length || 0);
  const MAX_CHARS = 100;

  const handleDescriptionChange = (value: string) => {
    if (value.length <= MAX_CHARS) {
      handleChange("description", value);
      setCharCount(value.length);
    }
  };

  const getCharCountColor = () => {
    const percentage = (charCount / MAX_CHARS) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-slate-400';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label 
          htmlFor="description"
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          <Type className="w-4 h-4" />
          <span>Description</span>
        </label>
        <span className={`text-xs ${getCharCountColor()} transition-colors duration-200`}>
          {charCount}/{MAX_CHARS} characters
        </span>
      </div>

      <div className={`relative rounded-lg transition-all duration-300
        ${isFocused ? 'ring-2 ring-blue-100 ring-offset-2' : 'ring-1 ring-slate-200'}`}
      >
        <textarea
          id="description"
          value={goal.description || ""}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Write a clear description of your goal..."
          className="block w-full px-4 py-3 rounded-lg border-0 
            bg-white dark:bg-slate-900
            placeholder:text-slate-400 text-slate-900 dark:text-slate-100
            focus:ring-0 sm:text-sm sm:leading-6"
          rows={3}
        />

        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {goal.description && (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs 
              font-medium text-slate-400 bg-slate-50 rounded border border-slate-200">
              <CornerDownRight className="w-3 h-3" />
              <span>Shift + Enter for new line</span>
            </kbd>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {charCount >= MAX_CHARS && (
          <div className="flex items-center gap-2 text-xs text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span>Maximum character limit reached</span>
          </div>
        )}
        
        {goal.description && goal.description.length < 10 && (
          <div className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Tip: A good description helps clarify your goal and track progress
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionInput;