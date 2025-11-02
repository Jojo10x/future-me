import React, { useEffect, useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Loader, Zap, Target, Clock, BarChart3, AlertCircle } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';

const MLInsightsView: React.FC = () => {
  const { mlInsights, mlLoading, fetchMLInsights, trainMLModel, goals } = useGoals();
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    fetchMLInsights();
  }, []);

  const handleTrainModel = async () => {
    setIsTraining(true);
    await trainMLModel();
    await fetchMLInsights();
    setIsTraining(false);
  };

  const getConfidenceColor = (level?: string) => {
    switch(level) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 0.7) return 'text-green-600';
    if (prob >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity?: string) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const needsTraining = mlInsights?.predictions?.every(
    p => p.completion_probability === 0.5 && p.confidence_level === 'low'
  ) || false;

  if (mlLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          <Brain className="h-8 w-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-600 animate-pulse">Running ML predictions...</p>
      </div>
    );
  }

  if (!mlInsights || !mlInsights.predictions) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
        <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ML Models Not Available
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          You need at least 10 goals to train the machine learning models. Currently you have {goals?.length || 0} goals.
        </p>
        {(goals?.length || 0) >= 10 && (
          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isTraining ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Training Models...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Train ML Models
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  const { predictions = [], best_practices, summary } = mlInsights;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Machine Learning Predictions</h2>
              <p className="text-purple-100 text-sm">
                Predictive analytics powered by Random Forest & Gradient Boosting
              </p>
            </div>
          </div>
          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTraining ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Retrain Models
              </>
            )}
          </button>
        </div>
      </div>

      {needsTraining && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">Models Not Trained Yet</h3>
              <p className="text-sm text-yellow-800 mb-3">
                The ML models are showing default predictions (50% probability). Click &quot;Retrain Models&quot; above to train them on your historical data for accurate predictions.
              </p>
              <button
                onClick={handleTrainModel}
                disabled={isTraining}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {isTraining ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Train Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <p className="text-xs text-gray-600">Total Active</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{summary.total_active_goals || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-xs text-gray-600">High Risk</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{summary.high_risk_goals || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-xs text-gray-600">On Track</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{summary.on_track_goals || 0}</p>
          </div>
        </div>
      )}

      {best_practices?.subtask_effectiveness && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Your Best Practices</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">With Subtasks</p>
              <p className="text-2xl font-bold text-blue-600">
                {best_practices.subtask_effectiveness.with_subtasks_avg_days || 0}d
              </p>
              <p className="text-xs text-gray-500 mt-1">avg completion</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Without Subtasks</p>
              <p className="text-2xl font-bold text-purple-600">
                {best_practices.subtask_effectiveness.without_subtasks_avg_days || 0}d
              </p>
              <p className="text-xs text-gray-500 mt-1">avg completion</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-700">
            💡 <strong>Recommendation:</strong> {best_practices.subtask_effectiveness.recommendation || 'Keep tracking your goals'}
          </p>
          {best_practices.best_quarter && (
            <p className="mt-2 text-sm text-gray-700">
              🎯 <strong>Peak Performance:</strong> Q{best_practices.best_quarter} is your most productive quarter
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Goal-by-Goal Predictions
          {needsTraining && (
            <span className="text-xs text-yellow-600 font-normal">(Default predictions - train models for accuracy)</span>
          )}
        </h3>
        
        {predictions.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Active Goals
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Create some goals to see ML predictions and insights!
            </p>
          </div>
        ) : (
          predictions.map((pred, idx) => {
            if (!pred?.goal) return null;
            
            const isDefaultPrediction = pred.completion_probability === 0.5 && pred.confidence_level === 'low';
            
            return (
              <div
                key={idx}
                className={`bg-white rounded-lg p-6 border-2 ${
                  isDefaultPrediction ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                } hover:border-purple-300 shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {pred.goal.title || 'Untitled Goal'}
                    </h4>
                    <p className="text-sm text-gray-600">Year: {pred.goal.year || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(pred.confidence_level)}`}>
                      {(pred.confidence_level || 'low').toUpperCase()} CONFIDENCE
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Completion Probability
                      {isDefaultPrediction && (
                        <span className="text-xs text-yellow-600 ml-2">(Default - train models)</span>
                      )}
                    </span>
                    <span className={`text-lg font-bold ${getProbabilityColor(pred.completion_probability || 0)}`}>
                      {((pred.completion_probability || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (pred.completion_probability || 0) >= 0.7 ? 'bg-green-500' :
                        (pred.completion_probability || 0) >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(pred.completion_probability || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {pred.estimated_days_to_complete && !isDefaultPrediction && (
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">
                      Estimated completion: <strong>{pred.estimated_days_to_complete} days</strong>
                    </span>
                  </div>
                )}

                {pred.risk_factors && pred.risk_factors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">RISK FACTORS</p>
                    <div className="space-y-2">
                      {pred.risk_factors.map((risk, rIdx) => {
                        if (!risk) return null;
                        return (
                          <div
                            key={rIdx}
                            className={`px-3 py-2 rounded-lg border ${getSeverityColor(risk.severity)}`}
                          >
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-semibold">{risk.factor || 'Unknown Risk'}</span>
                            </div>
                            <p className="text-xs mt-1">{risk.description || ''}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {pred.recommendations && pred.recommendations.length > 0 && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-xs font-semibold text-purple-900 mb-2">ML RECOMMENDATIONS</p>
                    <div className="space-y-1">
                      {pred.recommendations.map((rec, rIdx) => (
                        <p key={rIdx} className="text-sm text-purple-900">
                          {rec}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          <Brain className="h-3 w-3 inline mr-1" />
          Predictions update dynamically as you complete goals and add new data
        </p>
      </div>
    </div>
  );
};

export default MLInsightsView;