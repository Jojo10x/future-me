export interface Goal {
  id: number;
  title: string;
  description: string;
  year: number;
  is_completed: boolean;
}
export interface Goals {
  title?: string;
  description?: string;
  year?: number;
  id?: number;
  is_completed?: boolean;
}
