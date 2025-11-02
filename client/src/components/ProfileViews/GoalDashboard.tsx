import { Goal } from "@/types/types";
import { ListTodo, BarChart, Calendar, Clock, Flame, Lightbulb, Brain, Zap } from "lucide-react";
import { useState } from "react";
import  YearComparison from "./YearComparison ";
import { GraphsView } from "./GraphsView";
import { GoalView } from "./GoalView";
import GoalTimeAnalytics from "./GoalTimeAnalytics";
import GoalStreaksView from "./GoalStreaksView";
import GoalInsightsView from "./GoalInsightsView";
import AIRecommendationsView from "./AIRecommendationsView";
import MLInsightsView from "./MLInsightsView";

const GoalDashboard: React.FC<{ goals?: Goal[] }> = ({ goals = [] }) => {
  const [activeView, setActiveView] = useState<"goals" | "graphs" | "data" | "time" | "streaks" | "insights" | "ai" | "ml">("goals");

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveView("goals")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${activeView === "goals"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <ListTodo className="h-4 w-4" />
            Goals
          </button>
          <button
            onClick={() => setActiveView("graphs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${activeView === "graphs"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <BarChart className="h-4 w-4" />
            Graphs
          </button>
          <button
            onClick={() => setActiveView("data")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${activeView === "data"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <Calendar className="h-4 w-4" />
            Year
          </button>
          <button
            onClick={() => setActiveView("insights")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
      ${activeView === "insights"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <Lightbulb className="h-4 w-4" />
            Insights
          </button>
          <button
            onClick={() => setActiveView("streaks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
      ${activeView === "streaks"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <Flame className="h-4 w-4" />
            Streaks
          </button>
          <button
            onClick={() => setActiveView("time")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${activeView === "time"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <Clock className="h-4 w-4" />
            Time
          </button>
          <button
            onClick={() => setActiveView("ai")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
    ${activeView === "ai"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <Brain className="h-4 w-4" />
            AI
          </button>
          <button
            onClick={() => setActiveView("ml")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${activeView === "ml"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <Zap className="h-4 w-4" />
            ML Predict
          </button>
        </div>

        {activeView === "goals" && <GoalView goals={goals} />}
        {activeView === "graphs" && <GraphsView goals={goals} />}
        {activeView === "data" && <YearComparison goals={goals} />}
        {activeView === "time" && <GoalTimeAnalytics goals={goals} />}
        {activeView === "streaks" && <GoalStreaksView goals={goals} />}
        {activeView === "insights" && <GoalInsightsView goals={goals} />}
        {activeView === "ai" && <AIRecommendationsView />}
        {activeView === "ml" && <MLInsightsView />}

      </div>
    </div>
  );
};

export default GoalDashboard;
