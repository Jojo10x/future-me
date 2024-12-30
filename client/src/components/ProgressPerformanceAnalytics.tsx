import React, { useMemo } from 'react';
import { 
  BarChart, Bar, Line, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid, Area, 
  AreaChart, ComposedChart
} from 'recharts';
import { Goal } from '@/types/types';

const ProgressPerformanceAnalytics = ({ goals }: { goals: Goal[] }) => {
  const analytics = useMemo(() => {
    // Helper function to calculate days between dates
    const daysBetween = (date1: string, date2: string) => {
      return Math.ceil(
        (new Date(date2).getTime() - new Date(date1).getTime()) / (1000 * 60 * 60 * 24)
      );
    };

    // Progress Analytics
    const progressMetrics = goals.map(goal => {
      const subtaskCompletions = goal.subtasks
        .filter(task => task.is_completed).sort((a, b) => a - b);

      const firstSubtaskCompletion = subtaskCompletions[0]
        ? daysBetween(goal.created_at, new Date(subtaskCompletions[0]).toISOString())
        : null;

      const averageTimeBetweenSubtasks = subtaskCompletions.length > 1
        ? Math.round(
            subtaskCompletions
              .slice(1)
              .reduce((acc, time, i) => acc + (time - subtaskCompletions[i]) / (1000 * 60 * 60 * 24), 0) 
            / (subtaskCompletions.length - 1)
          )
        : null;

      return {
        goalId: goal.id,
        daysToFirstSubtask: firstSubtaskCompletion,
        averageTimeBetweenSubtasks,
        totalSubtasks: goal.subtasks.length,
        completedSubtasks: subtaskCompletions.length,
        age: daysBetween(goal.created_at, goal.completed_at || new Date().toISOString())
      };
    });

    // Calculate completion velocity by month
    const velocityByMonth: { [key: string]: { completed: number; total: number } } = {};
    goals.forEach(goal => {
      if (goal.completed_at) {
        const month = new Date(goal.completed_at).toLocaleString('default', { month: 'long' });
        velocityByMonth[month] = velocityByMonth[month] || { completed: 0, total: 0 };
        velocityByMonth[month].completed += 1;
      }
      const createMonth = new Date(goal.created_at).toLocaleString('default', { month: 'long' });
      velocityByMonth[createMonth] = velocityByMonth[createMonth] || { completed: 0, total: 0 };
      velocityByMonth[createMonth].total += 1;
    });

    // Age grouping for goals
    const ageGroups = {
      '0-7 days': 0,
      '8-30 days': 0,
      '31-90 days': 0,
      '90+ days': 0
    };

    progressMetrics.forEach(metric => {
      if (metric.age <= 7) ageGroups['0-7 days']++;
      else if (metric.age <= 30) ageGroups['8-30 days']++;
      else if (metric.age <= 90) ageGroups['31-90 days']++;
      else ageGroups['90+ days']++;
    });

    // Performance metrics
    const completedGoals = goals.filter(goal => goal.is_completed);
    const successRate = (completedGoals.length / goals.length) * 100;
    
    // Calculate efficiency (completed tasks / total time taken)
    const efficiency = completedGoals.map(goal => {
      const timeToComplete = daysBetween(goal.created_at, goal.completed_at!);
      return {
        date: goal.completed_at!.split('T')[0],
        efficiency: Math.round((goal.subtasks.filter(t => t.is_completed).length / timeToComplete) * 100) / 100
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      progressMetrics,
      velocityByMonth: Object.entries(velocityByMonth).map(([month, data]) => ({
        month,
        completed: data.completed,
        total: data.total,
        velocity: Math.round((data.completed / data.total) * 100)
      })),
      ageGroups: Object.entries(ageGroups).map(([range, count]) => ({
        range,
        count
      })),
      performanceMetrics: {
        successRate,
        averageAge: Math.round(
          progressMetrics.reduce((acc, curr) => acc + curr.age, 0) / progressMetrics.length
        ),
        efficiencyTrend: efficiency
      }
    };
  }, [goals]);

  return (
    <div className="space-y-8">
      {/* Progress Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {Math.round(analytics.performanceMetrics.successRate)}%
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Average Goal Age</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {analytics.performanceMetrics.averageAge} days
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {analytics.ageGroups.reduce((acc, curr) => acc + curr.count, 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Avg Time Between Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            {Math.round(
              analytics.progressMetrics.reduce((acc, curr) => 
                acc + (curr.averageTimeBetweenSubtasks || 0), 0
              ) / analytics.progressMetrics.length
            )} days
          </p>
        </div>
      </div>

      {/* Velocity Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Velocity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={analytics.velocityByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="total" fill="#94a3b8" name="Total Goals" />
              <Bar yAxisId="left" dataKey="completed" fill="#22c55e" name="Completed" />
              <Line yAxisId="right" dataKey="velocity" stroke="#7c3aed" name="Velocity %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal Age Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Age Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.ageGroups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Efficiency Trend */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.performanceMetrics.efficiencyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressPerformanceAnalytics;