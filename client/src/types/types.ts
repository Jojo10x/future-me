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

export interface AffectedGoal {
  id: number;
  title: string;
  days?: number;
  completion?: string;
  days_active?: number;
}

export interface AIRecommendation {
  type: 'velocity' | 'pattern' | 'time_allocation' | 'burnout_risk' | 'complexity' | 'temporal' | 'strategic';
  title: string;
  message: string;
  insight: string;
  action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  data_point: string;
  affected_goals?: AffectedGoal[];
}

export interface AIMetrics {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  completion_rate: number;
  avg_completion_days: number;
  goals_with_subtasks: number;
  current_year_goals: number;
}

export interface AIRecommendationsResponse {
  recommendations: AIRecommendation[];
  metrics: AIMetrics;
  analysis_timestamp: string;
}

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