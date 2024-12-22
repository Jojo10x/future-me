import { SubTask } from '@/types/types';

interface SubTaskListProps {
  subtasks: SubTask[];
  onComplete: (subtaskId: number) => void;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ subtasks = [], onComplete }) => {
  return (
    <div className="space-y-2">
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={subtask.is_completed}
            onChange={() => onComplete(subtask.id)}
            className="rounded border-gray-300"
          />
          <span className={subtask.is_completed ? "line-through text-slate-500" : ""}>
            {subtask.title}
          </span>
        </div>
      ))}
    </div>
  );
};