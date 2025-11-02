import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from datetime import datetime, timedelta
import joblib
import os
import re
from typing import Dict, List, Tuple, Optional
from django.utils import timezone
from django.conf import settings

class GoalCompletionPredictor:
    COMPLEX_KEYWORDS = [
        'build', 'create', 'develop', 'launch', 'establish', 'implement',
        'complete', 'finish', 'achieve', 'master', 'learn', 'study',
        'organize', 'plan', 'design', 'write', 'prepare', 'multiple'
    ]
    
    SIMPLE_KEYWORDS = [
        'buy', 'purchase', 'call', 'email', 'book', 'schedule',
        'register', 'sign up', 'attend', 'visit', 'watch', 'read',
        'pay', 'cancel', 'renew', 'update', 'fix', 'replace'
    ]
    
    SPECIFIC_VERBS = [
        'run', 'complete', 'finish', 'attend', 'visit', 'travel',
        'celebrate', 'experience', 'try', 'taste', 'see', 'meet'
    ]
    
    def __init__(self):
        self.completion_model = None
        self.time_model = None
        self.scaler = StandardScaler()
        self.model_path = os.path.join(settings.BASE_DIR, 'ml_models')
        os.makedirs(self.model_path, exist_ok=True)
    
    def _analyze_goal_complexity(self, title: str, description: str = None) -> Dict:
        title_lower = title.lower()
        desc_lower = (description or '').lower()
        combined_text = f"{title_lower} {desc_lower}"
        
        complexity_score = 0
        
        complex_count = sum(1 for keyword in self.COMPLEX_KEYWORDS if keyword in combined_text)
        simple_count = sum(1 for keyword in self.SIMPLE_KEYWORDS if keyword in combined_text)
        
        if complex_count > simple_count:
            complexity_score += 2
        elif simple_count > complex_count:
            complexity_score -= 2
        
        multi_objective_indicators = ['and', ' & ', ' + ', ',', 'then', 'followed by', 'after']
        if any(indicator in combined_text for indicator in multi_objective_indicators):
            complexity_score += 1
        

        word_count = len(title.split())
        if word_count > 8:
            complexity_score += 1
        elif word_count <= 3:
            complexity_score -= 1
        
        vague_indicators = ['improve', 'better', 'more', 'less', 'increase', 'decrease', 'enhance']
        specific_indicators = self.SPECIFIC_VERBS
        
        if any(indicator in title_lower for indicator in vague_indicators):
            complexity_score += 1
        if any(indicator in title_lower for indicator in specific_indicators):
            complexity_score -= 1
        
        has_numbers = bool(re.search(r'\d+', combined_text))
        has_deadline_words = any(word in combined_text for word in ['by', 'until', 'before', 'within'])
        
        if has_numbers or has_deadline_words:
            complexity_score -= 1 
        project_indicators = ['project', 'program', 'initiative', 'campaign', 'series', 'course']
        if any(indicator in combined_text for indicator in project_indicators):
            complexity_score += 2
        
        return {
            'complexity_score': complexity_score,
            'is_likely_complex': complexity_score >= 2,
            'is_likely_simple': complexity_score <= -1,
            'has_multiple_objectives': any(indicator in combined_text for indicator in multi_objective_indicators),
            'is_vague': any(indicator in title_lower for indicator in vague_indicators),
            'is_specific': has_numbers or has_deadline_words,
            'word_count': word_count
        }
    
    def extract_features(self, goals_queryset) -> pd.DataFrame:
        features = []
        
        for goal in goals_queryset:
            try:
                complexity_analysis = self._analyze_goal_complexity(
                    goal.title, 
                    goal.description
                )

                created_date = goal.created_at
                days_active = (timezone.now() - created_date).days
                month_created = created_date.month
                quarter_created = (created_date.month - 1) // 3 + 1
                day_of_week_created = created_date.weekday()
                
                title_length = len(goal.title)
                title_word_count = len(goal.title.split())
                has_description = 1 if goal.description else 0
                description_length = len(goal.description) if goal.description else 0
                
                subtask_count = goal.subtasks.count()
                has_subtasks = 1 if subtask_count > 0 else 0
                
                if subtask_count > 0:
                    completed_subtasks = goal.subtasks.filter(is_completed=True).count()
                    subtask_completion_rate = completed_subtasks / subtask_count
                else:
                    completed_subtasks = 0
                    subtask_completion_rate = 0
                
                user_goals = goal.user.goals.exclude(id=goal.id)
                user_total_goals = user_goals.count()
                user_completed_goals = user_goals.filter(is_completed=True).count()
                user_completion_rate = user_completed_goals / user_total_goals if user_total_goals > 0 else 0
                
                completed_goals_with_time = user_goals.filter(
                    is_completed=True, 
                    completed_at__isnull=False
                )
                if completed_goals_with_time.exists():
                    completion_times = [
                        (g.completed_at - g.created_at).days 
                        for g in completed_goals_with_time
                    ]
                    user_avg_completion_days = np.mean(completion_times)
                    user_median_completion_days = np.median(completion_times)
                else:
                    user_avg_completion_days = 0
                    user_median_completion_days = 0
                
                is_current_year = 1 if goal.year == timezone.now().year else 0
                years_old = timezone.now().year - goal.year
                
                is_completed = 1 if goal.is_completed else 0
                
                if goal.is_completed and goal.completed_at:
                    completion_days = (goal.completed_at - goal.created_at).days
                else:
                    completion_days = None
                
                features.append({
                    'goal_id': goal.id,
                    'goal_title': goal.title,
                    'goal_description': goal.description or '',
                    # Temporal
                    'days_active': days_active,
                    'month_created': month_created,
                    'quarter_created': quarter_created,
                    'day_of_week_created': day_of_week_created,
                    # Complexity
                    'title_length': title_length,
                    'title_word_count': title_word_count,
                    'has_description': has_description,
                    'description_length': description_length,
                    'complexity_score': complexity_analysis['complexity_score'],
                    'is_likely_complex': 1 if complexity_analysis['is_likely_complex'] else 0,
                    'is_likely_simple': 1 if complexity_analysis['is_likely_simple'] else 0,
                    'has_multiple_objectives': 1 if complexity_analysis['has_multiple_objectives'] else 0,
                    'is_vague': 1 if complexity_analysis['is_vague'] else 0,
                    'is_specific': 1 if complexity_analysis['is_specific'] else 0,
                    # Subtasks
                    'subtask_count': subtask_count,
                    'has_subtasks': has_subtasks,
                    'completed_subtasks': completed_subtasks,
                    'subtask_completion_rate': subtask_completion_rate,
                    # User history
                    'user_total_goals': user_total_goals,
                    'user_completed_goals': user_completed_goals,
                    'user_completion_rate': user_completion_rate,
                    'user_avg_completion_days': user_avg_completion_days,
                    'user_median_completion_days': user_median_completion_days,
                    # Engagement
                    'is_current_year': is_current_year,
                    'years_old': years_old,
                    # Targets
                    'is_completed': is_completed,
                    'completion_days': completion_days
                })
            except Exception as e:
                print(f"Error extracting features for goal {goal.id}: {e}")
                continue
        
        return pd.DataFrame(features)
    
    def train_models(self, goals_queryset):
        """Train ML models on historical goal data"""
        print("Extracting features...")
        df = self.extract_features(goals_queryset)
        
        if len(df) < 10:
            raise ValueError("Need at least 10 goals to train models")
        
        feature_cols = [
            'days_active', 'month_created', 'quarter_created', 'day_of_week_created',
            'title_length', 'title_word_count', 'has_description', 'description_length',
            'complexity_score', 'is_likely_complex', 'is_likely_simple',
            'has_multiple_objectives', 'is_vague', 'is_specific',
            'subtask_count', 'has_subtasks', 'completed_subtasks', 'subtask_completion_rate',
            'user_total_goals', 'user_completed_goals', 'user_completion_rate',
            'user_avg_completion_days', 'user_median_completion_days',
            'is_current_year', 'years_old'
        ]
        
        X = df[feature_cols]
        
        print("Training completion prediction model...")
        y_completion = df['is_completed']
        
        if len(y_completion.unique()) > 1:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y_completion, test_size=0.2, random_state=42, stratify=y_completion
            )
            
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            self.completion_model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                class_weight='balanced'
            )
            self.completion_model.fit(X_train_scaled, y_train)
            
            train_score = self.completion_model.score(X_train_scaled, y_train)
            test_score = self.completion_model.score(X_test_scaled, y_test)
            print(f"Completion model - Train score: {train_score:.3f}, Test score: {test_score:.3f}")
        
        completed_df = df[df['is_completed'] == 1].copy()
        
        if len(completed_df) >= 10:
            print("Training time prediction model...")
            X_time = completed_df[feature_cols]
            y_time = completed_df['completion_days']
            
            X_time_scaled = self.scaler.transform(X_time)
            
            self.time_model = GradientBoostingRegressor(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                random_state=42
            )
            self.time_model.fit(X_time_scaled, y_time)
            
            time_score = self.time_model.score(X_time_scaled, y_time)
            print(f"Time model - R² score: {time_score:.3f}")
        
        self.save_models()
        
        return {
            'completion_model_trained': self.completion_model is not None,
            'time_model_trained': self.time_model is not None,
            'training_samples': len(df),
            'feature_importance': self.get_feature_importance(feature_cols) if self.completion_model else {}
        }
    
    def predict_goal_completion(self, goal) -> Dict:
        if not self.completion_model:
            self.load_models()
        
        if not self.completion_model:
            return {
                'error': 'Model not trained yet',
                'completion_probability': 0.5,
                'estimated_days': None
            }
        
        df = self.extract_features([goal])
        
        if df.empty:
            return {'error': 'Could not extract features'}
        
        feature_cols = [
            'days_active', 'month_created', 'quarter_created', 'day_of_week_created',
            'title_length', 'title_word_count', 'has_description', 'description_length',
            'complexity_score', 'is_likely_complex', 'is_likely_simple',
            'has_multiple_objectives', 'is_vague', 'is_specific',
            'subtask_count', 'has_subtasks', 'completed_subtasks', 'subtask_completion_rate',
            'user_total_goals', 'user_completed_goals', 'user_completion_rate',
            'user_avg_completion_days', 'user_median_completion_days',
            'is_current_year', 'years_old'
        ]
        
        X = df[feature_cols].values
        X_scaled = self.scaler.transform(X)
        
        completion_prob = self.completion_model.predict_proba(X_scaled)[0][1]
        
        estimated_days = None
        if self.time_model:
            estimated_days = int(self.time_model.predict(X_scaled)[0])
        
        recommendations = self._generate_smart_recommendations(
            goal, df.iloc[0], completion_prob, estimated_days
        )
        
        return {
            'goal_id': goal.id,
            'completion_probability': round(completion_prob, 3),
            'estimated_days_to_complete': estimated_days,
            'confidence_level': self._calculate_confidence(completion_prob),
            'recommendations': recommendations,
            'risk_factors': self._identify_risk_factors(df.iloc[0], completion_prob)
        }
    
    def _generate_smart_recommendations(self, goal, features, completion_prob, estimated_days) -> List[str]:
        recommendations = []
        
        complexity_analysis = self._analyze_goal_complexity(goal.title, goal.description)
        
        if completion_prob < 0.4:
            recommendations.append("⚠️ Low completion probability detected. This goal needs attention.")
            
            if (features['subtask_count'] == 0 and 
                complexity_analysis['is_likely_complex'] and
                not complexity_analysis['is_likely_simple']):
                recommendations.append(
                    f"💡 '{goal.title[:50]}...' appears to be a complex goal. "
                    "Breaking it into 3-5 concrete steps could increase success rate by 40%."
                )
            
            elif (features['subtask_count'] == 0 and 
                  complexity_analysis['is_likely_simple']):
                recommendations.append(
                    "🎯 This appears to be a straightforward goal. "
                    "Set a specific date/time to complete it rather than adding subtasks."
                )
            
            if complexity_analysis['is_vague']:
                recommendations.append(
                    "📝 Make this goal more specific: Add measurable criteria or a clear success definition."
                )
            
            if features['days_active'] > 60:
                recommendations.append(
                    f"⏰ Active for {features['days_active']} days. "
                    "Schedule 30 minutes this week to make progress or re-evaluate its priority."
                )
        
        elif completion_prob > 0.75:
            recommendations.append("✅ High completion likelihood! You're on track.")
            
            if estimated_days and estimated_days < 30:
                recommendations.append(f"🎯 Estimated completion in ~{estimated_days} days. Maintain momentum!")
        
        if (features['has_subtasks'] and 
            features['subtask_completion_rate'] < 0.3 and 
            features['days_active'] > 30 and
            complexity_analysis['is_likely_complex']):
            recommendations.append(
                "📊 Low subtask progress. Pick ONE subtask to complete this week. "
                "Small wins create momentum."
            )
        
        if complexity_analysis['has_multiple_objectives'] and features['subtask_count'] == 0:
            recommendations.append(
                "🔀 This goal contains multiple objectives. "
                "Consider splitting it into separate goals or adding subtasks for each part."
            )
        
        if estimated_days:
            if estimated_days > 90 and not complexity_analysis['is_likely_complex']:
                recommendations.append(
                    f"⏳ Estimated {estimated_days} days seems long for this goal. "
                    "Consider if scope can be reduced or timeline shortened."
                )
            elif estimated_days > features['user_avg_completion_days'] * 1.5:
                recommendations.append(
                    "📈 This will take longer than your average. "
                    "Block dedicated time in your calendar to stay on track."
                )
        
        if features['user_completion_rate'] < 0.4 and features['user_total_goals'] > 5:
            recommendations.append(
                "🎓 Focus Mode: You have many goals with low completion rate. "
                "Choose your top 3 priorities and archive the rest temporarily."
            )
        
        return recommendations
    
    def _identify_risk_factors(self, features, completion_prob) -> List[Dict]:
        """Identify specific risk factors affecting completion"""
        risk_factors = []
        
        complexity_analysis = self._analyze_goal_complexity(
            features.get('goal_title', ''), 
            features.get('goal_description', '')
        )
        
        if features['days_active'] > 90:
            risk_factors.append({
                'factor': 'Prolonged Duration',
                'severity': 'high',
                'description': f"Goal active for {features['days_active']} days with no completion"
            })
        
        if (features['subtask_count'] == 0 and 
            features['days_active'] > 30 and
            complexity_analysis['is_likely_complex'] and
            not complexity_analysis['is_likely_simple']):
            risk_factors.append({
                'factor': 'Lacks Structure',
                'severity': 'medium',
                'description': 'Complex goal without defined action steps'
            })
        
        if features['subtask_completion_rate'] < 0.2 and features['has_subtasks']:
            risk_factors.append({
                'factor': 'Stalled Progress',
                'severity': 'high',
                'description': f"Only {features['subtask_completion_rate']*100:.0f}% of subtasks completed"
            })
        
        if complexity_analysis['is_vague']:
            risk_factors.append({
                'factor': 'Vague Goal',
                'severity': 'medium',
                'description': 'Goal lacks specific, measurable criteria'
            })
        
        if features['years_old'] > 0:
            risk_factors.append({
                'factor': 'Outdated Goal',
                'severity': 'medium',
                'description': f"Goal from {features['years_old']} year(s) ago may need re-evaluation"
            })
        
        return risk_factors
    
    def _calculate_confidence(self, probability) -> str:
        """Calculate confidence level in prediction"""
        if probability > 0.8 or probability < 0.2:
            return 'high'
        elif probability > 0.6 or probability < 0.4:
            return 'medium'
        else:
            return 'low'
    
    def get_feature_importance(self, feature_names) -> Dict[str, float]:
        """Get feature importance from trained model"""
        if not self.completion_model:
            return {}
        
        importances = self.completion_model.feature_importances_
        return dict(sorted(
            zip(feature_names, importances),
            key=lambda x: x[1],
            reverse=True
        ))
    
    def save_models(self):
        """Save trained models to disk"""
        if self.completion_model:
            joblib.dump(self.completion_model, os.path.join(self.model_path, 'completion_model.pkl'))
            joblib.dump(self.scaler, os.path.join(self.model_path, 'scaler.pkl'))
            print("Completion model saved")
        
        if self.time_model:
            joblib.dump(self.time_model, os.path.join(self.model_path, 'time_model.pkl'))
            print("Time model saved")
    
    def load_models(self):
        """Load trained models from disk"""
        try:
            completion_path = os.path.join(self.model_path, 'completion_model.pkl')
            scaler_path = os.path.join(self.model_path, 'scaler.pkl')
            time_path = os.path.join(self.model_path, 'time_model.pkl')
            
            if os.path.exists(completion_path):
                self.completion_model = joblib.load(completion_path)
                self.scaler = joblib.load(scaler_path)
                print("Completion model loaded")
            
            if os.path.exists(time_path):
                self.time_model = joblib.load(time_path)
                print("Time model loaded")
        except Exception as e:
            print(f"Error loading models: {e}")


class GoalStrategyOptimizer:
    @staticmethod
    def analyze_best_practices(goals_queryset) -> Dict:
        """Identify what works best for the user"""
        completed = goals_queryset.filter(is_completed=True, completed_at__isnull=False)
        
        if completed.count() < 5:
            return {
                'message': 'Need more completed goals for pattern analysis',
                'subtask_effectiveness': {
                    'with_subtasks_avg_days': 0,
                    'without_subtasks_avg_days': 0,
                    'recommendation': 'Complete at least 5 goals to unlock best practices analysis',
                    'sample_size_with': 0,
                    'sample_size_without': 0
                },
                'best_quarter': None,
                'quarterly_avg_completion': {}
            }
        
        try:
            predictor = GoalCompletionPredictor()
            
            with_subtasks_times = []
            without_subtasks_times = []
            
            for goal in completed:
                try:
                    if not goal.completed_at:
                        continue
                        
                    completion_time = (goal.completed_at - goal.created_at).days
                    
                    # Safely analyze complexity
                    complexity = predictor._analyze_goal_complexity(
                        goal.title, 
                        goal.description or ''
                    )
                    
                    if complexity.get('is_likely_complex', False):
                        try:
                            if goal.subtasks.exists():
                                with_subtasks_times.append(completion_time)
                            else:
                                without_subtasks_times.append(completion_time)
                        except Exception as e:
                            print(f"Error checking subtasks for goal {goal.id}: {e}")
                            
                            without_subtasks_times.append(completion_time)
                            
                except Exception as e:
                    print(f"Error processing goal {goal.id} in best practices: {e}")
                    continue
            
            avg_time_with = np.mean(with_subtasks_times) if with_subtasks_times else 0
            avg_time_without = np.mean(without_subtasks_times) if without_subtasks_times else 0
            
            if len(with_subtasks_times) < 3 and len(without_subtasks_times) < 3:
                recommendation = "Not enough data yet - keep completing goals to unlock insights"
            elif len(with_subtasks_times) < 3:
                recommendation = "You complete goals well without subtasks - keep it simple"
            elif len(without_subtasks_times) < 3:
                recommendation = "Subtasks are working well for you - continue using them for complex goals"
            elif avg_time_with < avg_time_without * 0.8:
                recommendation = "Subtasks significantly improve your completion speed for complex goals"
            elif avg_time_with > avg_time_without * 1.3:
                recommendation = "You complete goals faster without subtasks - keep goals simple and direct"
            else:
                recommendation = "Subtasks show marginal benefit - use them only for truly complex goals"
            
            quarterly_performance = {}
            for goal in completed:
                try:
                    if goal.completed_at:
                        quarter = (goal.completed_at.month - 1) // 3 + 1
                        if quarter not in quarterly_performance:
                            quarterly_performance[quarter] = []
                        quarterly_performance[quarter].append((goal.completed_at - goal.created_at).days)
                except Exception as e:
                    print(f"Error processing quarterly data for goal {goal.id}: {e}")
                    continue
            
            best_quarter = None
            if quarterly_performance:
                try:
                    best_quarter = min(quarterly_performance.items(), 
                                      key=lambda x: np.mean(x[1]))[0]
                except Exception as e:
                    print(f"Error calculating best quarter: {e}")
            
            return {
                'subtask_effectiveness': {
                    'with_subtasks_avg_days': round(avg_time_with, 1),
                    'without_subtasks_avg_days': round(avg_time_without, 1),
                    'recommendation': recommendation,
                    'sample_size_with': len(with_subtasks_times),
                    'sample_size_without': len(without_subtasks_times)
                },
                'best_quarter': best_quarter,
                'quarterly_avg_completion': {
                    f'Q{q}': round(np.mean(days), 1) 
                    for q, days in quarterly_performance.items()
                }
            }
        except Exception as e:
            print(f"Error in analyze_best_practices: {e}")
            import traceback
            traceback.print_exc()
            
            return {
                'subtask_effectiveness': {
                    'with_subtasks_avg_days': 0,
                    'without_subtasks_avg_days': 0,
                    'recommendation': 'Analysis temporarily unavailable',
                    'sample_size_with': 0,
                    'sample_size_without': 0
                },
                'best_quarter': None,
                'quarterly_avg_completion': {}
            }