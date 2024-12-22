import { Dispatch, SetStateAction } from "react";
import { Goal, NewGoal } from "@/types/types";

type BaseGoalFormProps = {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
};

type EditingGoalFormProps = BaseGoalFormProps & {
  isEditing: true;
  goal: Goal;
  setGoal: Dispatch<SetStateAction<Goal | null>>;
};

type CreatingGoalFormProps = BaseGoalFormProps & {
  isEditing: false;
  goal: Partial<NewGoal>;
  setGoal: Dispatch<SetStateAction<Partial<NewGoal>>>;
};

type GoalFormProps = EditingGoalFormProps | CreatingGoalFormProps;

export const GoalForm: React.FC<GoalFormProps> = ({
  isEditing,
  goal,
  onSubmit,
  setGoal,
  onClose,
}) => {
  const handleChange = <K extends keyof (Goal | NewGoal)>(
    field: K,
    value: (Goal | NewGoal)[K]
  ) => {
    if (isEditing) {
      setGoal((prev: Goal | null) =>
        prev ? { ...prev, [field]: value } : null
      );
    } else {
      setGoal((prev: Partial<NewGoal>) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubtaskAdd = () => {
    if (isEditing) {
      setGoal((prev: Goal | null) =>
        prev
          ? {
              ...prev,
              subtasks: [
                ...prev.subtasks,
                {
                  id: Date.now(),
                  goalId: prev.id,
                  title: "",
                  is_completed: false,
                },
              ],
            }
          : null
      );
    } else {
      setGoal((prev: Partial<NewGoal>) => ({
        ...prev,
        subtasks: [
          ...(prev.subtasks || []),
          { title: "", is_completed: false },
        ],
      }));
    }
  };

  const handleSubtaskChange = (index: number, value: string) => {
    if (isEditing) {
      setGoal((prev: Goal | null) => {
        if (!prev) return null;
        const newSubtasks = [...prev.subtasks];
        newSubtasks[index] = { ...newSubtasks[index], title: value };
        return { ...prev, subtasks: newSubtasks };
      });
    } else {
      setGoal((prev: Partial<NewGoal>) => {
        const subtasks = [...(prev.subtasks || [])];
        subtasks[index] = { ...subtasks[index], title: value };
        return { ...prev, subtasks };
      });
    }
  };

  const handleSubtaskRemove = (index: number) => {
    if (isEditing) {
      setGoal((prev: Goal | null) => {
        if (!prev) return null;
        const newSubtasks = prev.subtasks.filter((_, i) => i !== index);
        return { ...prev, subtasks: newSubtasks };
      });
    } else {
      setGoal((prev: Partial<NewGoal>) => {
        const subtasks = (prev.subtasks || []).filter((_, i) => i !== index);
        return { ...prev, subtasks };
      });
    }
  };

  const isDescriptionMode = goal.description !== undefined;
  const subtasks = isEditing ? goal.subtasks : (goal.subtasks || []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Goal" : "Add New Goal"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Goal Title
            </label>
            <input
              type="text"
              value={goal.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={isDescriptionMode ? "description" : "subtasks"}
              onChange={(e) => {
                const newType = e.target.value;
                if (newType === "description") {
                  handleChange("description", "");
                  handleChange("subtasks", []);
                } else {
                  handleChange("description", undefined);
                  handleChange("subtasks", []);
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="description">Description</option>
              <option value="subtasks">Subtasks</option>
            </select>
          </div>

          {isDescriptionMode ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={goal.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtasks
              </label>
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter subtask"
                  />
                  <button
                    type="button"
                    onClick={() => handleSubtaskRemove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleSubtaskAdd}
                className="text-blue-500 hover:text-blue-700"
              >
                + Add Subtask
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Year
            </label>
            <input
              type="number"
              value={goal.year || ""}
              onChange={(e) => handleChange("year", parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};