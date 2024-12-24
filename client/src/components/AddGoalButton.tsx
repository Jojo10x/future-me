import React from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

type AddGoalButtonProps = {
  onClick: () => Promise<void> | void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
};

export const AddGoalButton: React.FC<AddGoalButtonProps> = ({ 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false 
}) => {
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
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-105 active:scale-100
        ${sizeClasses[size]}
        ${variantClasses[variant]}
      `}
    >
      {isLoading ? (
        <Loader2 className={`
          animate-spin
          ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
          mr-2
        `}/>
      ) : (
        <PlusCircle className={`
          ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
          mr-2
        `}/>
      )}
      Add New Goal
    </button>
  );
};

export default AddGoalButton;