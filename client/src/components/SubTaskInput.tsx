import { SubTask } from '@/types/types';

interface SubTaskInputProps {
  subtask: Partial<SubTask>;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export const SubTaskInput: React.FC<SubTaskInputProps> = ({ subtask, onChange, onRemove }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={subtask.title || ''}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Subtask title"
        required
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </div>
  );
};