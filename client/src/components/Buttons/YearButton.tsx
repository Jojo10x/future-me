type YearButtonProps = {
  year: number | string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

export const YearButton: React.FC<YearButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all ${
      isSelected
        ? "bg-emerald-700 text-white shadow-lg"
        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow"
    }`}
  >
    {label}
  </button>
);
