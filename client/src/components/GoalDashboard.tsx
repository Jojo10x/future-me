import { Goal } from "@/types/types";
import { ListTodo, BarChart, Database } from "lucide-react";
import { useState } from "react";
import { DataView } from "./Dataview";
import { GraphsView } from "./GraphsView";

const GoalDashboard: React.FC<{ goals?: Goal[] }> = ({ goals = [] }) => {
  const [activeView, setActiveView] = useState<"goals" | "graphs" | "data">(
    "goals"
  );

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-6">
        {/* View Selection Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveView("goals")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${
                  activeView === "goals"
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
                ${
                  activeView === "graphs"
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
                ${
                  activeView === "data"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
          >
            <Database className="h-4 w-4" />
            Data
          </button>
        </div>

        {activeView === "goals" && <DataView goals={goals} />}
        {activeView === "graphs" && <GraphsView goals={goals} />}
        {activeView === "data" && <DataView goals={goals} />}
      </div>
    </div>
  );
};

export default GoalDashboard;
