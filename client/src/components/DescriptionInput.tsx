import { Goal, NewGoal } from "@/types/types";

export const DescriptionInput: React.FC<{
    goal: Goal | Partial<NewGoal>;
    handleChange: <K extends keyof (Goal | NewGoal)>(field: K, value: (Goal | NewGoal)[K]) => void;
  }> = ({ goal, handleChange }) => (
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
  );
  