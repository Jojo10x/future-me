import React, { useMemo } from 'react';
import { Goal } from '@/types/types';
import { AlertTriangle, Clock, TrendingUp, CheckCircle2, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GoalInsightsProps {
  goals: Goal[];
}

const GoalInsightsView: React.FC<GoalInsightsProps> = ({ goals }) => {
  const insights = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const completedGoals = goals.filter(g => g.is_completed && g.completed_at);
    
    const timeInvestments = completedGoals.map(goal => {
      const created = new Date(goal.created_at);
      const completed = new Date(goal.completed_at!);
      const days = Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return { goal, days };
    });

    const quickWins = timeInvestments.filter(t => t.days <= 30);
    const shortTerm = timeInvestments.filter(t => t.days > 30 && t.days <= 90);
    const mediumTerm = timeInvestments.filter(t => t.days > 90 && t.days <= 180);
    const longTerm = timeInvestments.filter(t => t.days > 180);

    const timeDistribution = [
      { name: 'Quick Wins', label: '≤ 30 days', count: quickWins.length, color: '#10b981' },
      { name: 'Short-term', label: '31-90 days', count: shortTerm.length, color: '#3b82f6' },
      { name: 'Medium-term', label: '91-180 days', count: mediumTerm.length, color: '#f59e0b' },
      { name: 'Long-term', label: '180+ days', count: longTerm.length, color: '#8b5cf6' }
    ];

    const quarters = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
    const seasonalData = quarters.map((quarter, idx) => {
      const quarterGoals = completedGoals.filter(g => {
        const completedDate = new Date(g.completed_at!);
        const month = completedDate.getMonth();
        return Math.floor(month / 3) === idx;
      });
      return {
        quarter,
        completed: quarterGoals.length,
        color: ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981'][idx]
      };
    });

    const bestQuarter = [...seasonalData].sort((a, b) => b.completed - a.completed)[0];

    const activeGoals = goals.filter(g => !g.is_completed);
    
    const goalsAtRisk = activeGoals.filter(goal => {
      const created = new Date(goal.created_at);
      const daysSinceCreation = Math.ceil((currentDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      
      const oldGoal = daysSinceCreation > 180;
      const overdueYear = goal.year < currentYear;
      const stuckSubtasks = goal.subtasks.length > 0 && goal.subtasks.every(st => !st.is_completed);
      
      return oldGoal || overdueYear || stuckSubtasks;
    });

    const highRisk = goalsAtRisk.filter(g => {
      const daysSince = Math.ceil((currentDate.getTime() - new Date(g.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 365 || g.year < currentYear - 1;
    });

    const mediumRisk = goalsAtRisk.filter(g => {
      const daysSince = Math.ceil((currentDate.getTime() - new Date(g.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return (daysSince >= 180 && daysSince <= 365) || g.year === currentYear - 1;
    });

    const lowRisk = goalsAtRisk.filter(g => {
      const daysSince = Math.ceil((currentDate.getTime() - new Date(g.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince < 180 && g.year === currentYear && !highRisk.includes(g) && !mediumRisk.includes(g);
    });

    const avgCompletionTime = timeInvestments.length > 0
      ? Math.round(timeInvestments.reduce((sum, t) => sum + t.days, 0) / timeInvestments.length)
      : 0;

    return {
      timeDistribution,
      seasonalData,
      bestQuarter,
      goalsAtRisk: {
        total: goalsAtRisk.length,
        high: highRisk,
        medium: mediumRisk,
        low: lowRisk
      },
      avgCompletionTime,
      totalActive: activeGoals.length
    };
  }, [goals]);

  const getRiskColor = (level: 'high' | 'medium' | 'low') => {
    switch(level) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700';
      case 'medium': return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'low': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  const getRiskBadgeColor = (level: 'high' | 'medium' | 'low') => {
    switch(level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 shadow-sm border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Avg Completion Time</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {insights.avgCompletionTime}
          </p>
          <p className="text-sm text-gray-600 mt-1">days to complete</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 shadow-sm border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Best Quarter</h3>
          </div>
          <p className="text-xl font-bold text-purple-600">
            {insights.bestQuarter.quarter}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {insights.bestQuarter.completed} goals completed
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 shadow-sm border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Goals at Risk</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {insights.goalsAtRisk.total}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            of {insights.totalActive} active goals
          </p>
        </div>
      </div>

      {/* Time Investment Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Time Investment Distribution
        </h3>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights.timeDistribution}>
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Goals Completed', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {insights.timeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {insights.timeDistribution.map((item, idx) => (
            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">{item.label}</p>
              <p className="text-2xl font-bold" style={{ color: item.color }}>
                {item.count}
              </p>
              <p className="text-xs text-gray-500">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quarterly Completion Patterns
        </h3>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights.seasonalData}>
              <XAxis dataKey="quarter" />
              <YAxis label={{ value: 'Goals Completed', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="completed" radius={[8, 8, 0, 0]}>
                {insights.seasonalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <p className="text-sm text-gray-700">
              <strong>Insight:</strong> You complete most goals in <strong>{insights.bestQuarter.quarter}</strong>. 
              Consider starting important goals a quarter earlier to maximize your natural productivity rhythm.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Goals Requiring Attention
        </h3>
        
        {insights.goalsAtRisk.total === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-900">All Goals on Track!</p>
            <p className="text-sm text-gray-600 mt-1">No goals are currently at risk.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.goalsAtRisk.high.length > 0 && (
              <div className={`rounded-lg p-4 border ${getRiskColor('high')}`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5" />
                  <h4 className="font-semibold">High Risk ({insights.goalsAtRisk.high.length})</h4>
                </div>
                <div className="space-y-2">
                  {insights.goalsAtRisk.high.slice(0, 3).map(goal => {
                    const daysSince = Math.ceil((new Date().getTime() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={goal.id} className="flex items-center justify-between bg-white bg-opacity-50 p-3 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{goal.title}</p>
                          <p className="text-xs text-gray-600">
                            Created {daysSince} days ago • Year {goal.year}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskBadgeColor('high')}`}>
                          High Risk
                        </span>
                      </div>
                    );
                  })}
                  {insights.goalsAtRisk.high.length > 3 && (
                    <p className="text-xs text-gray-600 text-center mt-2">
                      +{insights.goalsAtRisk.high.length - 3} more high risk goals
                    </p>
                  )}
                </div>
              </div>
            )}

            {insights.goalsAtRisk.medium.length > 0 && (
              <div className={`rounded-lg p-4 border ${getRiskColor('medium')}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5" />
                  <h4 className="font-semibold">Medium Risk ({insights.goalsAtRisk.medium.length})</h4>
                </div>
                <div className="space-y-2">
                  {insights.goalsAtRisk.medium.slice(0, 2).map(goal => {
                    const daysSince = Math.ceil((new Date().getTime() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={goal.id} className="flex items-center justify-between bg-white bg-opacity-50 p-3 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{goal.title}</p>
                          <p className="text-xs text-gray-600">
                            Created {daysSince} days ago • Year {goal.year}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskBadgeColor('medium')}`}>
                          Medium Risk
                        </span>
                      </div>
                    );
                  })}
                  {insights.goalsAtRisk.medium.length > 2 && (
                    <p className="text-xs text-gray-600 text-center mt-2">
                      +{insights.goalsAtRisk.medium.length - 2} more medium risk goals
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {insights.goalsAtRisk.high.length > 0 && (
                  <li>• Review high-risk goals: decide to complete, reschedule, or archive them</li>
                )}
                {insights.goalsAtRisk.medium.length > 0 && (
                  <li>• Set specific deadlines for medium-risk goals to prevent them becoming high-risk</li>
                )}
                {insights.avgCompletionTime > 90 && (
                  <li>• Your average completion time is {insights.avgCompletionTime} days. Consider breaking goals into smaller milestones</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalInsightsView;