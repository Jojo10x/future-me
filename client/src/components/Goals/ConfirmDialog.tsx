import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div 
        className="bg-white rounded-lg shadow-xl w-80 p-4 transform transition-all duration-200 ease-out animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete Goal?</h3>
          <p className="mt-2 text-sm text-gray-500">
            This action cannot be undone
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;