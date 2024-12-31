import { Goal } from "@/types/types";
import { AddGoalButton } from "./AddGoalButton";
import ProgressTracker from "./ProgressTracker";
import logo from "../../public/logo--text----future-me.svg";
import Image from "next/image";
import { ProfileBtn } from "./ProfileBtn";

type HeaderProps = {
  goals: Goal[];
  onAddGoal: () => void;
};

export const Header: React.FC<HeaderProps> = ({ goals, onAddGoal }) => (
  <div className="flex flex-col gap-4 mb-8">
    <div className="flex items-center justify-between w-full">
      <Image
        width={100}
        height={100}
        src={logo}
        alt="PixelTochka Logo"
        className="ml-2"
      />
      <div className="flex items-center space-x-4">
        <AddGoalButton onClick={onAddGoal} />
        <ProfileBtn />
      </div>
    </div>
    <ProgressTracker goals={goals} />
  </div>
);