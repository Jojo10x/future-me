"use client";
import { useEffect, useState} from 'react';
import GoalItem from '../components/GoalItem';
import { Goal, NewGoal } from '@/types/types';
import { Header } from '@/components/Header';
import { YearFilter } from '@/components/YearFilter';
import { GoalForm } from '@/components/GoalForm';

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filterYear, setFilterYear] = useState<number | string>('');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<NewGoal>>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
  });
  useEffect(() => {
    fetchGoals();
  }, [filterYear]);
  const fetchGoals = async () => {
    try {
      let url = 'http://localhost:8000/api/goals/';
      if (filterYear) {
        url += `?year=${filterYear}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/goals/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      });
      if (!response.ok) throw new Error('Failed to add goal');
      setNewGoal({ title: '', description: '', year: new Date().getFullYear(), is_completed: false });
      setIsAddingGoal(false);
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/goals/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleComplete = async (goal: Goal) => {
    try {
      const response = await fetch(`http://localhost:8000/api/goals/${goal.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !goal.is_completed }),
      });
      if (!response.ok) throw new Error('Failed to update goal');
      setGoals(goals.map(g =>
        g.id === goal.id ? { ...g, is_completed: !g.is_completed } : g
      ));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGoal?.id) return;

    try {
      const response = await fetch(`http://localhost:8000/api/goals/${editingGoal.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGoal),
      });
      if (!response.ok) throw new Error('Failed to update goal');
      setGoals(goals.map(g => (g.id === editingGoal.id ? editingGoal : g)));
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleSubtaskComplete = async (goalId: number, subtaskId: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const updatedSubtasks = goal.subtasks.map(st =>
        st.id === subtaskId ? { ...st, is_completed: !st.is_completed } : st
      );

      const allSubtasksCompleted = updatedSubtasks.every(st => st.is_completed);

      const response = await fetch(`http://localhost:8000/api/goals/${goalId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtasks: updatedSubtasks,
          is_completed: allSubtasksCompleted
        }),
      });

      if (!response.ok) throw new Error('Failed to update subtask');

      setGoals(goals.map(g => g.id === goalId ? {
        ...g,
        subtasks: updatedSubtasks,
        is_completed: allSubtasksCompleted
      } : g));
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header goals={goals} onAddGoal={() => setIsAddingGoal(true)} />
        <YearFilter 
          filterYear={filterYear} 
          goals={goals} 
          setFilterYear={setFilterYear} 
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onDelete={() => handleDelete(goal.id)}
              onComplete={() => handleComplete(goal)}
              onEdit={() => setEditingGoal(goal)}
              onSubtaskComplete={(subtaskId) => handleSubtaskComplete(goal.id, subtaskId)}
            />
          ))}
        </div>

        {isAddingGoal && (
          <GoalForm
            isEditing={false}
            goal={newGoal}
            onSubmit={handleAddGoal}
            setGoal={setNewGoal}
            onClose={() => setIsAddingGoal(false)}
          />
        )}

        {editingGoal && (
          <GoalForm
            isEditing={true}
            goal={editingGoal}
            onSubmit={handleUpdateGoal}
            setGoal={setEditingGoal }
            onClose={() => setEditingGoal(null)}
          />
        )}
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}