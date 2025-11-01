import React, { useState } from "react";
import { Goal } from "@/types/types";
import { Target, Medal, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useMemo } from "react";
import { YearFilter } from "@/components/Year/YearFilter";

export const GraphsView = ({ goals }: { goals: Goal[] }) => {
  const [filterYear, setFilterYear] = useState<number | string>(new Date().getFullYear());
  
  const filteredGoals = useMemo(() => {
    if (filterYear === "") return goals;
    return goals.filter(goal => goal.year === filterYear);
  }, [goals, filterYear]);

  const progressData = useMemo(() => {
    const monthlyProgress = filteredGoals.reduce((acc, goal) => {
      const month = new Date(goal.created_at).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { completed: 0, total: 0 };
      }
      acc[month].total += 1;
      if (goal.is_completed) {
        acc[month].completed += 1;
      }
      return acc;
    }, {} as Record<string, { completed: number; total: number }>);

    return Object.entries(monthlyProgress).map(([month, data]) => ({
      month,
      completionRate: (data.completed / data.total) * 100,
      totalGoals: data.total
    }));
  }, [filteredGoals]);

  const completionStats = useMemo(() => {
    const completed = filteredGoals.filter(g => g.is_completed).length;
    const total = filteredGoals.length;
    return [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: total - completed }
    ];
  }, [filteredGoals]);

  const COLORS = ['#10B981', '#6B7280'];

  const completionRate = filteredGoals.length > 0
    ? ((filteredGoals.filter(g => g.is_completed).length / filteredGoals.length) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8">
      <YearFilter
        filterYear={filterYear}
        goals={goals}
        setFilterYear={setFilterYear}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-600">
            <Target className="h-5 w-5" />
            <h3 className="font-medium">Total Goals</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{filteredGoals.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600">
            <Medal className="h-5 w-5" />
            <h3 className="font-medium">Completion Rate</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{completionRate}%</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-medium">Active Goals</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {filteredGoals.filter(g => !g.is_completed).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Monthly Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#10B981"
                  name="Completion Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Goal Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {completionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphsView;