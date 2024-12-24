import { Goal } from "@/types/types";
import { AddGoalButton } from "./AddGoalButton";
import ProgressTracker from "./ProgressTracker";
import logo from "../../public/logo--text----future-me.svg";
import Image from "next/image";

type HeaderProps = {
  goals: Goal[];
  onAddGoal: () => void;
};

export const Header: React.FC<HeaderProps> = ({ goals, onAddGoal }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Future Me
    </h1> */}
    <Image
          width={100}
          height={100}
          src={logo}
          alt="PixelTochka Logo"
          className="ml-2"
        />
    <ProgressTracker goals={goals} />
    <AddGoalButton onClick={onAddGoal} />
  </div>
);
