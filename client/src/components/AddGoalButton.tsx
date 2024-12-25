import React from 'react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type AddGoalButtonProps = {
  onClick: () => Promise<void> | void;
};

export const AddGoalButton: React.FC<AddGoalButtonProps> = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="
        group
        relative
        p-3
        bg-lime-600 
        hover:bg-lime-700 
        rounded-full
        transition-all 
        duration-200
        focus:outline-none 
        focus:ring-2 
        focus:ring-green-500 
        focus:ring-offset-2
        disabled:opacity-50
      "
    >
      <Plus 
        className="w-5 h-5 text-white" 
        strokeWidth={2.5}
      />
    </button>
  );
};

export default AddGoalButton;