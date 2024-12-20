type FormActionsProps = {
  onClose: () => void;
  isEditing: boolean;
};

export const FormActions: React.FC<FormActionsProps> = ({
  onClose,
  isEditing,
}) => (
  <div className="flex justify-end gap-3">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      {isEditing ? "Save Changes" : "Add Goal"}
    </button>
  </div>
);
