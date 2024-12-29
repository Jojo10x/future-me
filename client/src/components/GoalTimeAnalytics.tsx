import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Goal } from '@/types/types';

const GoalTimeAnalytics = ({ goals }: { goals: Goal[] }) => {
  const timeAnalytics = useMemo(() => {
    const completedGoals = goals.filter(goal => 
      goal.is_completed && goal.completed_at && goal.created_at
    );

    const completionTimes = completedGoals.map(goal => {
      const created = new Date(goal.created_at);
      const completed = new Date(goal.completed_at!);
      return Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    });

    const averageTime = completionTimes.length > 0 
      ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
      : 0;
    const fastestTime = Math.min(...(completionTimes.length ? completionTimes : [0]));
    const longestTime = Math.max(...(completionTimes.length ? completionTimes : [0]));

    const creationByMonth: { [key: string]: number } = {};
    const completionByMonth: { [key: string]: number } = {};
    
    goals.forEach(goal => {
      const creationMonth = new Date(goal.created_at).toLocaleString('default', { month: 'long' });
      creationByMonth[creationMonth] = (creationByMonth[creationMonth] || 0) + 1;
      
      if (goal.completed_at) {
        const completionMonth = new Date(goal.completed_at).toLocaleString('default', { month: 'long' });
        completionByMonth[completionMonth] = (completionByMonth[completionMonth] || 0) + 1;
      }
    });

    const monthlyData = Object.keys(creationByMonth).map(month => ({
      month,
      created: creationByMonth[month],
      completed: completionByMonth[month] || 0
    }));

    return {
      averageTime,
      fastestTime,
      longestTime,
      monthlyData
    };
  }, [goals]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Average Completion Time</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {timeAnalytics.averageTime} days
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Fastest Completion</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {timeAnalytics.fastestTime} days
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Longest Completion</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {timeAnalytics.longestTime} days
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeAnalytics.monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="created" 
                name="Goals Created" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="completed" 
                name="Goals Completed" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GoalTimeAnalytics;