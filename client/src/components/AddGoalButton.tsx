  type AddGoalButtonProps = {
    onClick: () => void;
  };
  
  export const AddGoalButton: React.FC<AddGoalButtonProps> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
      Add New Goal
    </button>
  );
  