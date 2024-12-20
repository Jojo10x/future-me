type CloseButtonProps = {
  onClick: () => void;
};

export const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);
