import React, { useState } from 'react';
import { Calendar, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { Goal, NewGoal } from '@/types/types';

interface YearInputProps {
  goal: Goal | Partial<NewGoal>;
  handleChange: <K extends keyof (Goal | NewGoal)>(field: K, value: (Goal | NewGoal)[K]) => void;
}

export const YearInput: React.FC<YearInputProps> = ({
  goal,
  handleChange
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 1;
  const maxYear = currentYear + 10;

  const handleYearChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      handleChange("year", numValue);
    }
  };

  const incrementYear = () => {
    const currentValue = goal.year || currentYear;
    if (currentValue < maxYear) {
      handleChange("year", currentValue + 1);
    }
  };

  const decrementYear = () => {
    const currentValue = goal.year || currentYear;
    if (currentValue > minYear) {
      handleChange("year", currentValue - 1);
    }
  };

  const isValidYear = (year: number) => {
    return year >= minYear && year <= maxYear;
  };

  return (
    <div className="space-y-2">
      <label 
        htmlFor="year-input"
        className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        <Calendar className="w-4 h-4" />
        <span>Target Year</span>
      </label>

      <div className={`relative rounded-lg transition-all duration-300
        ${isFocused ? 'ring-2 ring-blue-100 ring-offset-2' : 'ring-1 ring-slate-200'}`}>
        <input
          id="year-input"
          type="number"
          value={goal.year || ''}
          onChange={(e) => handleYearChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          min={minYear}
          max={maxYear}
          className="block w-full pl-4 pr-12 py-3 rounded-lg border-0
            bg-white dark:bg-slate-900
            placeholder:text-slate-400 text-slate-900 dark:text-slate-100
            focus:ring-0 sm:text-m"
          placeholder={currentYear.toString()}
          required
        />
        
        <div className="absolute inset-y-0 right-0 flex flex-col border-l border-slate-200">
          <button
            type="button"
            onClick={incrementYear}
            className="flex-1 px-2 text-slate-400 hover:text-slate-600 
              hover:bg-slate-50 transition-colors"
            disabled={goal.year === maxYear}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={decrementYear}
            className="flex-1 px-2 text-slate-400 hover:text-slate-600 
              hover:bg-slate-50 transition-colors border-t border-slate-200"
            disabled={goal.year === minYear}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {goal.year && !isValidYear(goal.year) && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>
            Please select a year between {minYear} and {maxYear}
          </span>
        </div>
      )}

      <div className="text-xs text-slate-500">
        {goal.year ? (
          <>
            {goal.year === currentYear && "Setting goals for this year"}
            {goal.year > currentYear && `Planning ${goal.year - currentYear} years ahead`}
            {goal.year < currentYear && "Goal from previous year"}
          </>
        ) : (
          "Select the target year for your goal"
        )}
      </div>
    </div>
  );
};

export default YearInput;