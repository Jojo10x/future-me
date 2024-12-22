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
}

export type NewGoal = Omit<Goal, 'id' | 'is_completed' | 'subtasks'> & {
  is_completed?: boolean;
  subtasks?: Omit<SubTask, 'id' | 'goalId'>[];
};