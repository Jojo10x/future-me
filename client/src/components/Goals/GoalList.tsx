import GoalItem from '@/components/Goals/GoalItem';
import { Goal } from '@/types/types';

interface GoalListProps {
  goals: Goal[];
  onDelete: (id: number) => void;
  onComplete: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onSubtaskComplete: (goalId: number, subtaskId: number) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onDelete, onComplete, onEdit, onSubtaskComplete }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          onDelete={() => onDelete(goal.id)}
          onComplete={() => onComplete(goal)}
          onEdit={() => onEdit(goal)}
          onSubtaskComplete={(subtaskId) => onSubtaskComplete(goal.id, subtaskId)}
        />
      ))}
    </div>
  );
};

export default GoalList;
