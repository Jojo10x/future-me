import {
  EditingGoalFormProps,
  CreatingGoalFormProps,
  Goal,
  NewGoal,
} from "@/types/types";
import { Modal } from "./Modal";
import { SubtaskLists } from "./SubtaskLists";
import { DescriptionInput } from "./DescriptionInput";
import { FormAction } from "./FormAction";
import { GoalTitleInput } from "./GoalTitleInput";
import { GoalTypeSelector } from "./GoalTypeSelector";
import { YearInput } from "./YearInput";

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
        prev
          ? {
              ...prev,
              [field]: value,
              is_completed: prev.is_completed,
            }
          : null
      );
    } else {
      setGoal((prev: Partial<NewGoal>) => ({
        ...prev,
        [field]: value,
        is_completed: false,
      }));
    }
  };

  const handleSubtaskAdd = () => {
    if (isEditing) {
      setGoal((prev: Goal | null) =>
        prev
          ? {
              ...prev,
              is_completed: prev.is_completed,
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
        is_completed: false,
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
        newSubtasks[index] = {
          ...newSubtasks[index],
          title: value,
          is_completed: newSubtasks[index].is_completed,
        };
        return {
          ...prev,
          subtasks: newSubtasks,
          is_completed: prev.is_completed,
        };
      });
    } else {
      setGoal((prev: Partial<NewGoal>) => {
        const subtasks = [...(prev.subtasks || [])];
        subtasks[index] = {
          ...subtasks[index],
          title: value,
          is_completed: false,
        };
        return {
          ...prev,
          subtasks,
          is_completed: false,
        };
      });
    }
  };

  const handleSubtaskRemove = (index: number) => {
    if (isEditing) {
      setGoal((prev: Goal | null) => {
        if (!prev) return null;
        const newSubtasks = prev.subtasks.filter((_, i) => i !== index);
        return {
          ...prev,
          subtasks: newSubtasks,
          is_completed: prev.is_completed,
        };
      });
    } else {
      setGoal((prev: Partial<NewGoal>) => {
        const subtasks = (prev.subtasks || []).filter((_, i) => i !== index);
        return {
          ...prev,
          subtasks,
          is_completed: false,
        };
      });
    }
  };

  const isDescriptionMode =
    goal.description !== undefined &&
    (!goal.subtasks || goal.subtasks.length === 0);
  const subtasks = goal.subtasks || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onSubmit(e);
    } else {
      onSubmit(e);
    }
  };

  return (
    <Modal title={isEditing ? "Edit Goal" : "Add New Goal"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <GoalTitleInput goal={goal} handleChange={handleChange} />
        <GoalTypeSelector
          isDescriptionMode={isDescriptionMode}
          handleChange={handleChange}
        />
        {isDescriptionMode ? (
          <DescriptionInput goal={goal} handleChange={handleChange} />
        ) : (
          <SubtaskLists
            subtasks={subtasks}
            handleSubtaskChange={handleSubtaskChange}
            handleSubtaskRemove={handleSubtaskRemove}
            handleSubtaskAdd={handleSubtaskAdd}
          />
        )}
        <YearInput goal={goal} handleChange={handleChange} />
        <FormAction isEditing={isEditing} onClose={onClose} />
      </form>
    </Modal>
  );
};
