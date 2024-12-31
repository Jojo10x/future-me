import React, { useState } from 'react';
import { ChevronDown, FileText, ListTodo, CheckCircle2 } from 'lucide-react';
import { Goal, NewGoal } from "@/types/types";

interface GoalTypeSelectorProps {
  isDescriptionMode: boolean;
  handleChange: <K extends keyof (Goal | NewGoal)>(
    field: K,
    value: (Goal | NewGoal)[K]
  ) => void;
}

export const GoalTypeSelector: React.FC<GoalTypeSelectorProps> = ({
  isDescriptionMode,
  handleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeChange = (newType: 'description' | 'subtasks') => {
    if (newType === "description") {
      handleChange("description", "");
      handleChange("subtasks", []);
    } else {
      handleChange("description", undefined);
      handleChange("subtasks", []);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label 
        htmlFor="goal-type"
        className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Type
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`mt-1.5 w-full flex items-center justify-between px-4 py-1.5 
          text-left rounded-lg border transition-all duration-200
          ${isOpen 
            ? 'border-blue-500 ring-2 ring-blue-100 ring-offset-2' 
            : 'border-slate-200 hover:border-slate-300'}`}
      >
        <div className="flex items-center gap-3">
          {isDescriptionMode ? (
            <FileText className="w-5 h-5 text-blue-500" />
          ) : (
            <ListTodo className="w-5 h-5 text-blue-500" />
          )}
          <div>
            <span className="text-sm font-medium text-blue-500">
              {isDescriptionMode ? 'Description' : 'Subtasks'}
            </span>
            <p className="text-xs text-white">
              {isDescriptionMode 
                ? 'Free-form text description' 
                : 'Break down into steps'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200
          ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-transparent" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute z-10 w-full mt-2 origin-top-right rounded-lg shadow-lg 
            bg-white border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={() => handleTypeChange('description')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left
                hover:bg-slate-50 transition-colors"
            >
              <FileText className={`w-5 h-5 ${isDescriptionMode ? 'text-blue-500' : 'text-slate-400'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Description</span>
                  {isDescriptionMode && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-slate-500">Add detailed notes about your goal</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('subtasks')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left
                hover:bg-slate-50 transition-colors"
            >
              <ListTodo className={`w-5 h-5 ${!isDescriptionMode ? 'text-blue-500' : 'text-slate-400'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Subtasks</span>
                  {!isDescriptionMode && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-slate-500">Break down into actionable steps</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GoalTypeSelector;