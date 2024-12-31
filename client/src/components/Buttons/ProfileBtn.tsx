import React from "react";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProfileBtn = () => {
  const router = useRouter();

  const handleNav = () => {
    router.push("/profile");
  };

  return (
    <button
      onClick={handleNav}
      className="
        group
        relative
        p-3
        bg-emerald-600
        dark:bg-gray-800
        hover:bg-emerald-700
        dark:hover:bg-emerald-700
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
