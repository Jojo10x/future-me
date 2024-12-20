import { Goals } from "@/types/types";
import { FormActions } from "./FormActions";
import { FormField } from "./FormField";
import { CloseButton } from "./CloseButton";

type GoalFormProps = {
    isEditing: boolean;
    goal: Goals;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    setGoal: (goal: Goals) => void;
    onClose: () => void;
  };
  
  export const GoalForm: React.FC<GoalFormProps> = ({
    isEditing,
    goal,
    onSubmit,
    setGoal,
    onClose,
  }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Goal' : 'Add New Goal'}
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            label="Goal Title"
            value={goal.title || ''}
            onChange={(e) => setGoal({ ...goal, title: e.target.value })}
            type="text"
            required
          />
          <FormField
            label="Description"
            value={goal.description || ''} 
            onChange={(e) => setGoal({ ...goal, description: e.target.value })}
            type="textarea"
          />
          <FormField
            label="Year"
            value={goal.year || ''}
            onChange={(e) => setGoal({ ...goal, year: parseInt(e.target.value) })}
            type="number"
            required
          />
          <FormActions onClose={onClose} isEditing={isEditing} />
        </form>
      </div>
    </div>
  );