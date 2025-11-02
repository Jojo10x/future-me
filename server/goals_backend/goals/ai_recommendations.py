from django.utils import timezone
from datetime import timedelta
import statistics
from typing import List, Dict, Any

class GoalAIAnalyzer:
    def __init__(self, goals_queryset):
        self.current_date = timezone.now()
        
        self.goals = list(goals_queryset.prefetch_related('subtasks'))
        self.completed_goals = [g for g in self.goals if g.is_completed and g.completed_at]
        self.active_goals = [g for g in self.goals if not g.is_completed]
        
    def generate_recommendations(self) -> Dict[str, Any]:
        """Main method to generate all recommendations"""
        recommendations = []
        
        try:
            recommendations.extend(self._analyze_goal_velocity())
        except Exception as e:
            print(f"Error in velocity analysis: {e}")
            
        try:
            recommendations.extend(self._analyze_goal_patterns())
        except Exception as e:
            print(f"Error in pattern analysis: {e}")
            
        try:
            recommendations.extend(self._analyze_time_allocation())
        except Exception as e:
            print(f"Error in time allocation analysis: {e}")
            
        try:
            recommendations.extend(self._detect_burnout_risk())
        except Exception as e:
            print(f"Error in burnout detection: {e}")
            
        try:
            recommendations.extend(self._analyze_goal_complexity())
        except Exception as e:
            print(f"Error in complexity analysis: {e}")
            
        try:
            recommendations.extend(self._analyze_temporal_patterns())
        except Exception as e:
            print(f"Error in temporal analysis: {e}")
            
        try:
            recommendations.extend(self._provide_strategic_insights())
        except Exception as e:
            print(f"Error in strategic insights: {e}")
        
        priority_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        recommendations.sort(key=lambda x: priority_order.get(x.get('priority', 'low'), 3))
        
        return {
            'recommendations': recommendations[:8], 
            'metrics': self._calculate_metrics(),
            'analysis_timestamp': self.current_date.isoformat()
        }
    
    def _calculate_metrics(self) -> Dict[str, Any]:
        total = len(self.goals)
        completed = len(self.completed_goals)
        active = len(self.active_goals)
        
        completion_times = self._get_completion_times()
        avg_completion = statistics.mean(completion_times) if completion_times else 0
        
        goals_with_subtasks = 0
        for goal in self.goals:
            try:
                if goal.subtasks.count() > 0:
                    goals_with_subtasks += 1
            except:
                pass
        
        return {
            'total_goals': total,
            'active_goals': active,
            'completed_goals': completed,
            'completion_rate': round((completed / total * 100) if total > 0 else 0, 1),
            'avg_completion_days': round(avg_completion, 1),
            'goals_with_subtasks': goals_with_subtasks,
            'current_year_goals': sum(1 for g in self.goals if g.year == self.current_date.year)
        }
    
    def _get_completion_times(self) -> List[float]:
        """Get completion times in days for completed goals"""
        times = []
        for goal in self.completed_goals:
            try:
                delta = (goal.completed_at - goal.created_at).total_seconds() / 86400
                times.append(delta)
            except:
                pass
        return times
    
    def _analyze_goal_velocity(self) -> List[Dict[str, Any]]:
        recommendations = []
        
        if len(self.goals) < 3:
            return recommendations
        
        if self.completed_goals:
            recent_completed = [g for g in self.completed_goals 
                              if g.completed_at >= self.current_date - timedelta(days=90)]
            velocity = len(recent_completed) / 3 
            
            if velocity < 0.5 and len(self.active_goals) > 5:
                recommendations.append({
                    'type': 'velocity',
                    'title': 'Declining Goal Momentum',
                    'message': f'You\'re completing {velocity:.1f} goals per month. With {len(self.active_goals)} active goals, this pace may lead to overwhelm.',
                    'insight': 'High performers focus on fewer goals simultaneously. Quality over quantity leads to better outcomes.',
                    'action': 'Consider archiving goals that are no longer aligned with your priorities',
                    'priority': 'high',
                    'confidence': 0.85,
                    'data_point': f'{velocity:.1f} goals/month'
                })
            elif velocity > 2 and len(self.active_goals) < 3:
                recommendations.append({
                    'type': 'velocity',
                    'title': 'Strong Momentum Detected',
                    'message': f'You\'re completing {velocity:.1f} goals per month with excellent focus.',
                    'insight': 'Your completion rate is exceptional. You have capacity for more ambitious challenges.',
                    'action': 'Consider adding 1-2 stretch goals that push your boundaries',
                    'priority': 'low',
                    'confidence': 0.9,
                    'data_point': f'{velocity:.1f} goals/month'
                })
        
        return recommendations
    
    def _analyze_goal_patterns(self) -> List[Dict[str, Any]]:
        recommendations = []
        
        creation_dates = [g.created_at for g in self.goals]
        if creation_dates:
            recent_creations = sum(1 for d in creation_dates 
                                 if d >= self.current_date - timedelta(days=30))
            
            if recent_creations > 5 and len(self.completed_goals) < recent_creations * 0.3:
                recommendations.append({
                    'type': 'pattern',
                    'title': 'Goal Creation Outpacing Completion',
                    'message': f'You\'ve created {recent_creations} goals in the last month but completion rate is low.',
                    'insight': 'Creating goals feels productive, but completion is what drives real progress. This pattern often indicates scattered focus.',
                    'action': 'Pause new goal creation for 2 weeks. Focus solely on completing existing goals',
                    'priority': 'high',
                    'confidence': 0.88,
                    'data_point': f'{recent_creations} new goals in 30 days'
                })
        
        year_distribution = {}
        for goal in self.active_goals:
            year_distribution[goal.year] = year_distribution.get(goal.year, 0) + 1
        
        past_year_goals = sum(count for year, count in year_distribution.items() 
                             if year < self.current_date.year)
        
        if past_year_goals > 3:
            recommendations.append({
                'type': 'pattern',
                'title': 'Carrying Forward Old Goals',
                'message': f'{past_year_goals} active goals are from previous years.',
                'insight': 'Goals from past years may no longer align with your current priorities. Unfinished goals create mental clutter.',
                'action': 'Review each old goal: Update the year if still relevant, or archive if priorities have changed',
                'priority': 'medium',
                'confidence': 0.82,
                'data_point': f'{past_year_goals} goals from past years'
            })
        
        return recommendations
    
    def _analyze_time_allocation(self) -> List[Dict[str, Any]]:
        """Analyze time investment patterns"""
        recommendations = []
        
        completion_times = self._get_completion_times()
        if len(completion_times) < 3:
            return recommendations
        
        avg_time = statistics.mean(completion_times)
        median_time = statistics.median(completion_times)
        
        if avg_time > median_time * 2:
            long_goals = [g for g in self.completed_goals 
                         if (g.completed_at - g.created_at).days > median_time * 2]
            
            recommendations.append({
                'type': 'time_allocation',
                'title': 'Time Estimation Inconsistency',
                'message': f'Some goals take {avg_time/median_time:.1f}x longer than your median completion time.',
                'insight': 'Large variance suggests difficulty in estimating goal complexity. This is common but improvable.',
                'action': 'For new goals, estimate completion time and set monthly checkpoints',
                'priority': 'medium',
                'confidence': 0.76,
                'data_point': f'Median: {median_time:.0f} days, Avg: {avg_time:.0f} days',
                'affected_goals': [{'id': g.id, 'title': g.title, 
                                  'days': (g.completed_at - g.created_at).days} 
                                 for g in long_goals[:3]]
            })
        
        stagnant_goals = []
        for goal in self.active_goals:
            days_active = (self.current_date - goal.created_at).days
            expected_completion = avg_time if avg_time > 0 else 90
            
            if days_active > expected_completion * 1.5:
                stagnant_goals.append({
                    'goal': goal,
                    'days_active': days_active,
                    'expected': expected_completion
                })
        
        if len(stagnant_goals) > 2:
            recommendations.append({
                'type': 'time_allocation',
                'title': 'Multiple Stagnant Goals Detected',
                'message': f'{len(stagnant_goals)} goals are taking significantly longer than your average.',
                'insight': 'Stagnant goals often indicate unclear next steps or misalignment with current priorities.',
                'action': 'For each stagnant goal, define one concrete action you can take this week',
                'priority': 'high',
                'confidence': 0.84,
                'data_point': f'{len(stagnant_goals)} goals overdue',
                'affected_goals': [{'id': sg['goal'].id, 'title': sg['goal'].title, 
                                  'days_active': sg['days_active']} 
                                 for sg in stagnant_goals[:3]]
            })
        
        return recommendations
    
    def _detect_burnout_risk(self) -> List[Dict[str, Any]]:
        recommendations = []
        
        if len(self.goals) < 5:
            return recommendations
        
        recent_goals = [g for g in self.goals 
                       if g.created_at >= self.current_date - timedelta(days=180)]
        old_goals = [g for g in self.goals 
                    if g.created_at < self.current_date - timedelta(days=180)]
        
        if recent_goals and old_goals:
            recent_completion = sum(1 for g in recent_goals if g.is_completed) / len(recent_goals)
            old_completion = sum(1 for g in old_goals if g.is_completed) / len(old_goals)
            
            if recent_completion < old_completion * 0.6 and old_completion > 0:
                recommendations.append({
                    'type': 'burnout_risk',
                    'title': 'Declining Completion Rate Detected',
                    'message': f'Your completion rate has dropped {((old_completion - recent_completion) / old_completion * 100):.0f}% in recent months.',
                    'insight': 'This pattern often precedes burnout. Early intervention is key to maintaining long-term productivity.',
                    'action': 'Take a strategic pause: Review your energy levels, simplify active goals, and prioritize rest',
                    'priority': 'critical',
                    'confidence': 0.79,
                    'data_point': f'Recent: {recent_completion*100:.0f}%, Previous: {old_completion*100:.0f}%'
                })
        
        if len(self.active_goals) > 12:
            recommendations.append({
                'type': 'burnout_risk',
                'title': 'Cognitive Overload Warning',
                'message': f'You have {len(self.active_goals)} active goals. Research shows optimal range is 5-7 goals.',
                'insight': 'Each active goal consumes mental bandwidth even when not actively worked on. This leads to decision fatigue.',
                'action': 'Use the Eisenhower Matrix: Categorize goals by urgent/important and archive the bottom 50%',
                'priority': 'high',
                'confidence': 0.91,
                'data_point': f'{len(self.active_goals)} active goals'
            })
        
        return recommendations
    
    def _analyze_goal_complexity(self) -> List[Dict[str, Any]]:
        """Analyze goal complexity and provide insights"""
        recommendations = []
        
        goals_with_subtasks = []
        goals_without_subtasks = []
        
        for goal in self.active_goals:
            try:
                subtask_count = goal.subtasks.count()
                if subtask_count > 0:
                    goals_with_subtasks.append(goal)
                else:
                    goals_without_subtasks.append(goal)
            except Exception as e:
                print(f"Error checking subtasks for goal {goal.id}: {e}")
                goals_without_subtasks.append(goal)
        
        if goals_with_subtasks:
            stuck_goals = []
            for goal in goals_with_subtasks:
                try:
                    subtasks = list(goal.subtasks.all())
                    if subtasks:
                        completed_subtasks = sum(1 for st in subtasks if st.is_completed)
                        completion_pct = completed_subtasks / len(subtasks)
                        days_active = (self.current_date - goal.created_at).days
                        
                        if completion_pct < 0.3 and days_active > 60:
                            stuck_goals.append({
                                'goal': goal,
                                'completion': completion_pct,
                                'days': days_active
                            })
                except Exception as e:
                    print(f"Error analyzing goal {goal.id} subtasks: {e}")
            
            if stuck_goals:
                recommendations.append({
                    'type': 'complexity',
                    'title': 'Goals with Stalled Progress',
                    'message': f'{len(stuck_goals)} goals have subtasks but little progress after 60+ days.',
                    'insight': 'Subtasks aren\'t inherently motivating. They need to be actionable, time-bound, and regularly reviewed.',
                    'action': 'For each stalled goal, identify one subtask to complete this week. Momentum builds momentum',
                    'priority': 'high',
                    'confidence': 0.83,
                    'data_point': f'{len(stuck_goals)} stalled goals',
                    'affected_goals': [{'id': sg['goal'].id, 'title': sg['goal'].title,
                                      'completion': f"{sg['completion']*100:.0f}%"} 
                                     for sg in stuck_goals[:3]]
                })
        
        long_active_simple = [g for g in goals_without_subtasks 
                             if (self.current_date - g.created_at).days > 90]
        
        if len(long_active_simple) > 2:
            recommendations.append({
                'type': 'complexity',
                'title': 'Long-Running Goals Need Structure',
                'message': f'{len(long_active_simple)} goals without subtasks have been active for 90+ days.',
                'insight': 'Goals without clear steps become abstract over time. Breaking them down creates psychological momentum.',
                'action': 'Add 3-5 concrete subtasks to each long-running goal. Make them specific and actionable',
                'priority': 'medium',
                'confidence': 0.77,
                'data_point': f'{len(long_active_simple)} goals need structure',
                'affected_goals': [{'id': g.id, 'title': g.title} for g in long_active_simple[:3]]
            })
        
        return recommendations
    
    def _analyze_temporal_patterns(self) -> List[Dict[str, Any]]:
        """Analyze when goals are created and completed"""
        recommendations = []
        
        if len(self.completed_goals) < 5:
            return recommendations
        
        quarterly_completions = {1: 0, 2: 0, 3: 0, 4: 0}
        for goal in self.completed_goals:
            quarter = (goal.completed_at.month - 1) // 3 + 1
            quarterly_completions[quarter] += 1
        
        best_quarter = max(quarterly_completions, key=quarterly_completions.get)
        worst_quarter = min(quarterly_completions, key=quarterly_completions.get)
        
        if quarterly_completions[best_quarter] > quarterly_completions[worst_quarter] * 2:
            quarter_names = {1: 'Q1 (Jan-Mar)', 2: 'Q2 (Apr-Jun)', 
                           3: 'Q3 (Jul-Sep)', 4: 'Q4 (Oct-Dec)'}
            
            recommendations.append({
                'type': 'temporal',
                'title': 'Seasonal Productivity Pattern Identified',
                'message': f'You complete {quarterly_completions[best_quarter]/quarterly_completions[worst_quarter]:.1f}x more goals in {quarter_names[best_quarter]} than {quarter_names[worst_quarter]}.',
                'insight': 'Everyone has natural productivity cycles. Smart goal-setters align important goals with high-energy periods.',
                'action': f'Schedule challenging goals to start in {quarter_names[best_quarter-1 if best_quarter > 1 else 4]} to capitalize on your productivity peak',
                'priority': 'low',
                'confidence': 0.74,
                'data_point': f'Best: Q{best_quarter} ({quarterly_completions[best_quarter]} goals)'
            })
        
        return recommendations
    
    def _provide_strategic_insights(self) -> List[Dict[str, Any]]:
        recommendations = []
        
        if len(self.goals) < 10:
            return recommendations
        
        all_words = []
        for goal in self.goals:
            words = goal.title.lower().split()
            all_words.extend([w for w in words if len(w) > 4])
        
        unique_ratio = len(set(all_words)) / len(all_words) if all_words else 0
        
        if unique_ratio < 0.4:
            recommendations.append({
                'type': 'strategic',
                'title': 'Limited Goal Diversity Detected',
                'message': 'Your goals show significant overlap in themes and areas.',
                'insight': 'While focus is good, balanced growth across life areas prevents blind spots and increases satisfaction.',
                'action': 'Consider goals in underrepresented areas: health, relationships, learning, or creativity',
                'priority': 'low',
                'confidence': 0.68,
                'data_point': f'{unique_ratio*100:.0f}% unique terms'
            })
        
        if self.completed_goals and self.active_goals:
            avg_completed_age = statistics.mean(
                [(g.completed_at - g.created_at).days for g in self.completed_goals]
            )
            avg_active_age = statistics.mean(
                [(self.current_date - g.created_at).days for g in self.active_goals]
            )
            
            if avg_active_age > avg_completed_age * 1.8:
                recommendations.append({
                    'type': 'strategic',
                    'title': 'Active Goals Aging Beyond Norm',
                    'message': f'Your active goals are {avg_active_age/avg_completed_age:.1f}x older than goals you typically complete.',
                    'insight': 'This suggests your current goals may be more ambitious or less aligned with current capacity.',
                    'action': 'Re-evaluate if active goals still serve your current life phase and priorities',
                    'priority': 'medium',
                    'confidence': 0.71,
                    'data_point': f'Active avg: {avg_active_age:.0f} days, Completed avg: {avg_completed_age:.0f} days'
                })
        
        return recommendations