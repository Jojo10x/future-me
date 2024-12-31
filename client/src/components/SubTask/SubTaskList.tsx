import { SubTask } from '@/types/types';

interface SubTaskListProps {
  subtasks: SubTask[];
  onComplete: (subtaskId: number) => void;
  goalId: number;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ subtasks, onComplete }) => {
  const handleCheckboxChange = (subtaskId: number) => {
    onComplete(subtaskId); 
  };

  return (
    <ul className="space-y-2">
      {subtasks.map((subtask) => (
        <li key={subtask.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={subtask.is_completed}
            onChange={() => handleCheckboxChange(subtask.id)} 
            className="form-checkbox h-4 w-4 text-teal-600"
          />
          <span className={subtask.is_completed ? "line-through text-slate-500" : ""}>
            {subtask.title}
          </span>
        </li>
      ))}
    </ul>
  );
};
