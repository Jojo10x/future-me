export const FormAction: React.FC<{
    isEditing: boolean;
    onClose: () => void;
  }> = ({ isEditing, onClose }) => (
    <div className="flex justify-end space-x-4  ">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-gray-700 hover:text-gray-900"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {isEditing ? "Update" : "Create"}
      </button>
    </div>
  );
  