import { Goal, NewGoal } from "@/types/types";

export const GoalTypeSelector: React.FC<{
    isDescriptionMode: boolean;
    handleChange: <K extends keyof (Goal | NewGoal)>(
      field: K,
      value: (Goal | NewGoal)[K]
    ) => void;
  }> = ({ isDescriptionMode, handleChange }) => (
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
  );
  