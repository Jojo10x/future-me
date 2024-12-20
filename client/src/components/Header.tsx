import { Goal } from "@/types/types";
import { AddGoalButton } from "./AddGoalButton";
import ProgressTracker from "./ProgressTracker";

type HeaderProps = {
  goals: Goal[];
  onAddGoal: () => void;
};

export const Header: React.FC<HeaderProps> = ({ goals, onAddGoal }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Future Me
    </h1>
    <ProgressTracker goals={goals} />
    <AddGoalButton onClick={onAddGoal} />
  </div>
);
