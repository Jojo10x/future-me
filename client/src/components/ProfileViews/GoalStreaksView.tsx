import React, { useMemo } from 'react';
import { Goal } from '@/types/types';
import { Flame, TrendingUp, Calendar, Zap } from 'lucide-react';

interface GoalStreaksViewProps {
  goals: Goal[];
}

const GoalStreaksView: React.FC<GoalStreaksViewProps> = ({ goals }) => {
  const streakData = useMemo(() => {
    const completedGoals = goals
      .filter(g => g.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

    let currentStreak = 0;
    const now = new Date();
    const monthlyCompletions: { [key: string]: number } = {};
    
    completedGoals.forEach(goal => {
      const date = new Date(goal.completed_at!);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyCompletions[monthKey] = (monthlyCompletions[monthKey] || 0) + 1;
    });

    for (let i = 0; i < 12; i++) {
      const checkDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}`;
      if (monthlyCompletions[monthKey]) {
        currentStreak++;
      } else {
        break;
      }
    }

    const mostProductiveMonth = Object.entries(monthlyCompletions)
      .sort((a, b) => b[1] - a[1])[0];
    
    const bestMonth = mostProductiveMonth 
      ? { 
          month: new Date(
            parseInt(mostProductiveMonth[0].split('-')[0]), 
            parseInt(mostProductiveMonth[0].split('-')[1])
          ).toLocaleString('default', { month: 'long', year: 'numeric' }),
          count: mostProductiveMonth[1]
        }
      : { month: 'N/A', count: 0 };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCompletions = completedGoals.filter(
      g => new Date(g.completed_at!) >= thirtyDaysAgo
    ).length;

    const monthsActive = new Set(
      goals.map(g => {
        const date = new Date(g.created_at);
        return `${date.getFullYear()}-${date.getMonth()}`;
      })
    ).size;
    
    const avgPerMonth = monthsActive > 0 
      ? (completedGoals.length / monthsActive).toFixed(1)
      : '0';

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const recentGoals = completedGoals.filter(
      g => new Date(g.completed_at!) >= threeMonthsAgo
    );
    
    const weeklyVelocity = recentGoals.length > 0 
      ? (recentGoals.length / 12).toFixed(1)
      : '0';

    return {
      currentStreak,
      bestMonth,
      recentCompletions,
      avgPerMonth,
      weeklyVelocity
    };
  }, [goals]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 shadow-sm border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Current Streak</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {streakData.currentStreak}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {streakData.currentStreak === 1 ? 'month' : 'months'} of consistent completions
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">30-Day Momentum</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {streakData.recentCompletions}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            goals completed last month
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 shadow-sm border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Weekly Velocity</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {streakData.weeklyVelocity}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            goals per week (3-month avg)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Most Productive Month</h3>
          </div>
          <p className="text-xl font-bold text-purple-600">
            {streakData.bestMonth.month}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {streakData.bestMonth.count} goals completed
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Average Completion Rate</h3>
          </div>
          <p className="text-xl font-bold text-indigo-600">
            {streakData.avgPerMonth}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            goals completed per month (all-time)
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
            <Flame className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keep the Momentum Going!</h3>
            <p className="text-gray-700">
              {streakData.currentStreak > 0 
                ? `Amazing! You're on a ${streakData.currentStreak}-month streak. Keep up the great work!`
                : streakData.recentCompletions > 0
                ? `You've completed ${streakData.recentCompletions} goals in the last 30 days. Start a streak by completing at least one goal this month!`
                : "Start your journey by completing your first goal this month. Consistency is key!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalStreaksView;