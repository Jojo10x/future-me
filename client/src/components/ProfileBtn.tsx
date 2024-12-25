import React from "react";
import { UserIcon } from "lucide-react";

export const ProfileBtn = () => {
  return (
    <button
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
      <UserIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
    </button>
  );
};
