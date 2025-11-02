import React, { useEffect } from 'react';
import { Sparkles, AlertCircle, Target, TrendingUp, CheckCircle, Brain, Zap, Clock, Activity } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { AIRecommendation, AIMetrics } from '@/types/types';

const AIRecommendationsView: React.FC = () => {
  const { aiRecommendations, aiLoading, fetchAIRecommendations } = useGoals();

  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  const recommendations: AIRecommendation[] = aiRecommendations?.recommendations || [];
  const metrics: AIMetrics | null = aiRecommendations?.metrics || null;

  const getIcon = (type: string) => {
    switch(type) {
      case 'velocity': return <Zap className="h-5 w-5" />;
      case 'pattern': return <Activity className="h-5 w-5" />;
      case 'time_allocation': return <Clock className="h-5 w-5" />;
      case 'burnout_risk': return <AlertCircle className="h-5 w-5" />;
      case 'complexity': return <Brain className="h-5 w-5" />;
      case 'temporal': return <TrendingUp className="h-5 w-5" />;
      case 'strategic': return <Target className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  const getColorClasses = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-50 border-red-300 text-red-900';
      case 'high': return 'bg-orange-50 border-orange-300 text-orange-900';
      case 'medium': return 'bg-yellow-50 border-yellow-300 text-yellow-900';
      case 'low': return 'bg-blue-50 border-blue-300 text-blue-900';
      default: return 'bg-gray-50 border-gray-300 text-gray-900';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'text-green-600';
    if (confidence >= 0.75) return 'text-blue-600';
    return 'text-gray-600';
  };

  if (aiLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          <Brain className="h-8 w-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-600 animate-pulse">Analyzing your goals with AI...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI-Powered Goal Intelligence</h2>
            <p className="text-purple-100 text-sm">
              Sophisticated pattern analysis across {metrics?.total_goals || 0} goals
            </p>
          </div>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-green-600">{metrics.completion_rate}%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Active Goals</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.active_goals}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Avg Completion</p>
            <p className="text-2xl font-bold text-purple-600">{metrics.avg_completion_days}d</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">This Year</p>
            <p className="text-2xl font-bold text-orange-600">{metrics.current_year_goals}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Exceptional Performance!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              AI analysis shows no areas of concern. Your goal management is highly effective.
              Keep maintaining this excellent momentum!
            </p>
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-6 border-2 ${getColorClasses(rec.priority)} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-white bg-opacity-50 rounded-lg">
                    {getIcon(rec.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">{rec.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">{rec.message}</p>
                  </div>
                </div>
              </div>

              <div className="ml-11 space-y-3">
                <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-current border-opacity-20">
                  <p className="text-xs font-semibold mb-1 opacity-75">AI INSIGHT</p>
                  <p className="text-sm italic">{rec.insight}</p>
                </div>

                <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-current border-opacity-20">
                  <p className="text-xs font-semibold mb-1 opacity-75">RECOMMENDED ACTION</p>
                  <p className="text-sm font-medium">→ {rec.action}</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-75">
                    <strong>Data Point:</strong> {rec.data_point}
                  </span>
                  <span className={`font-semibold ${getConfidenceColor(rec.confidence)}`}>
                    {(rec.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>

                {rec.affected_goals && rec.affected_goals.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <p className="text-xs font-semibold mb-2 opacity-75">AFFECTED GOALS</p>
                    <div className="space-y-1">
                      {rec.affected_goals.map((goal, gIdx) => (
                        <div key={gIdx} className="text-xs bg-white bg-opacity-40 rounded px-2 py-1">
                          • {goal.title}
                          {goal.days && ` (${goal.days} days)`}
                          {goal.completion && ` - ${goal.completion} complete`}
                          {goal.days_active && ` - Active ${goal.days_active} days`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          <Sparkles className="h-3 w-3 inline mr-1" />
          AI recommendations update in real-time based on your goal patterns and behaviors
        </p>
      </div>
    </div>
  );
};

export default AIRecommendationsView;