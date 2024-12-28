import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Goal } from '@/types/types';

const YearComparison = ({ goals }: { goals: Goal[] }) => {
  const availableYears = useMemo(() => 
    [...new Set(goals.map(goal => goal.year))].sort(),
    [goals]
  );

  const [selectedYears, setSelectedYears] = useState<number[]>([
    availableYears[0] || 0,
    availableYears[1] || 0
  ]);

  const stats = useMemo(() => {
    return selectedYears.map(year => {
      const yearGoals = goals.filter(goal => goal.year === year);
      const totalGoals = yearGoals.length;
      const completedGoals = yearGoals.filter(goal => goal.is_completed).length;
      const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
      
      const totalSubtasks = yearGoals.reduce((acc, goal) => acc + goal.subtasks.length, 0);
      const completedSubtasks = yearGoals.reduce(
        (acc, goal) => acc + goal.subtasks.filter(task => task.is_completed).length,
        0
      );
      const subtaskCompletionRate = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

      return {
        year,
        totalGoals,
        completedGoals,
        completionRate: Math.round(completionRate),
        totalSubtasks,
        completedSubtasks,
        subtaskCompletionRate: Math.round(subtaskCompletionRate)
      };
    });
  }, [goals, selectedYears]);

  const handleYearChange = (index: number, year: number) => {
    setSelectedYears(prev => {
      const newYears = [...prev];
      newYears[index] = year;
      return newYears;
    });
  };

  return (
    <div className="space-y-6">
      {/* Year Selection */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">First Year:</label>
          <select
            value={selectedYears[0]}
            onChange={(e) => handleYearChange(0, Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Second Year:</label>
          <select
            value={selectedYears[1]}
            onChange={(e) => handleYearChange(1, Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((yearStat) => (
          <div key={yearStat.year} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">{yearStat.year} Summary</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-600">Goals Completion</dt>
                <dd className="text-gray-900">{yearStat.completedGoals} / {yearStat.totalGoals}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-600">Completion Rate</dt>
                <dd className="text-gray-900">{yearStat.completionRate}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-600">Subtasks Completion</dt>
                <dd className="text-gray-900">{yearStat.completedSubtasks} / {yearStat.totalSubtasks}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-600">Subtask Completion Rate</dt>
                <dd className="text-gray-900">{yearStat.subtaskCompletionRate}%</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Yearly Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="completionRate" 
                name="Goal Completion Rate" 
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="subtaskCompletionRate" 
                name="Subtask Completion Rate" 
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default YearComparison;