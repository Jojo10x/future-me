export const SubtaskLists: React.FC<{
    subtasks: Array<{ title: string }>;
    handleSubtaskChange: (index: number, value: string) => void;
    handleSubtaskRemove: (index: number) => void;
    handleSubtaskAdd: () => void;
  }> = ({
    subtasks,
    handleSubtaskChange,
    handleSubtaskRemove,
    handleSubtaskAdd,
  }) => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Subtasks
      </label>
      {subtasks.map((subtask, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={subtask.title}
            onChange={(e) => handleSubtaskChange(index, e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter subtask"
          />
          <button
            type="button"
            onClick={() => handleSubtaskRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleSubtaskAdd}
        className="text-blue-500 hover:text-blue-700"
      >
        + Add Subtask
      </button>
    </div>
  );
  