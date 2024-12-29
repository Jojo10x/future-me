export interface SubTask {
  id: number;
  goalId: number;
  title: string;
  is_completed: boolean;
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  subtasks: SubTask[];
  year: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type NewGoal = Omit<Goal, 'id' | 'is_completed' | 'subtasks'> & {
  is_completed?: boolean;
  subtasks?: Omit<SubTask, 'id' | 'goalId'>[];
};

import { Dispatch, SetStateAction } from "react";

export type BaseGoalFormProps = {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
};

export type EditingGoalFormProps = BaseGoalFormProps & {
  isEditing: true;
  goal: Goal;
  setGoal: Dispatch<SetStateAction<Goal | null>>;
};

export type CreatingGoalFormProps = BaseGoalFormProps & {
  isEditing: false;
  goal: Partial<NewGoal>;
  setGoal: Dispatch<SetStateAction<Partial<NewGoal>>>;
};

export type GoalFormProps = EditingGoalFormProps | CreatingGoalFormProps;

