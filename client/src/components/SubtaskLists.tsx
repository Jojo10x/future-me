import React from 'react';
import { Plus, X, GripVertical, CheckCircle } from 'lucide-react';

interface Subtask {
  title: string;
  id?: string;
}

interface SubtaskListsProps {
  subtasks: Array<Subtask>;
  handleSubtaskChange: (index: number, value: string) => void;
  handleSubtaskRemove: (index: number) => void;
  handleSubtaskAdd: () => void;
}

export const SubtaskLists: React.FC<SubtaskListsProps> = ({
  subtasks,
  handleSubtaskChange,
  handleSubtaskRemove,
  handleSubtaskAdd,
}) => {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="space-y-3">
        {subtasks.map((subtask, index) => (
          <div
            key={index}
            className="group relative flex items-center gap-3 p-0.5 rounded-lg transition-all duration-300
              hover:bg-slate-50 focus-within:bg-slate-50 focus-within:ring-2 
              focus-within:ring-blue-100 focus-within:ring-offset-2"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md 
              text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4" />
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <CheckCircle className="w-4 h-4 text-slate-300" />
              </div>

              <input
                type="text"
                value={subtask.title}
                onChange={(e) => handleSubtaskChange(index, e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-md border-slate-200 
                  bg-white placeholder:text-slate-400 text-slate-600
                  focus:border-blue-300 focus:ring-0 transition-colors
                  sm:text-sm"
                placeholder="Add a subtask..."
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                <button
                  type="button"
                  onClick={() => handleSubtaskRemove(index)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-500 
                    hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubtaskAdd}
          className="group flex items-center gap-2 px-4 py-2.5 w-full sm:w-auto
            rounded-lg border border-dashed border-slate-300
            text-slate-500 hover:text-blue-600 hover:border-blue-300 
            hover:bg-blue-50/50 transition-all duration-300"
        >
          <Plus className="w-4 h-4 transition-transform duration-300
            group-hover:scale-110 group-hover:rotate-90" />
          <span className="text-sm font-medium">Add Subtask</span>
        </button>
      </div>

      {subtasks.length === 0 && (
        <div className="py-2 text-center">
          <p className="text-sm text-slate-500">
            No subtasks yet. Click the button above to add one.
          </p>
        </div>
      )}

      {subtasks.length >= 5 && (
        <div className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm">
          Tip: Break down complex tasks into smaller, manageable steps
        </div>
      )}
    </div>
  );
};

export default SubtaskLists;