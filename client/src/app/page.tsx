"use client";
import { useState, useEffect } from 'react';
import GoalItem from '../components/GoalItem';
import { Goal, Goals } from '@/types/types';
import { Header } from '@/components/Header';
import { YearFilter } from '@/components/YearFilter';
import { GoalForm } from '@/components/GoalForm';

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filterYear, setFilterYear] = useState<number | string>('');
  const [editingGoal, setEditingGoal] = useState<Goals | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Goals>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchGoals();
  }, [filterYear]);

  const fetchGoals = async () => {
    let url = 'http://localhost:8000/api/goals/';
    if (filterYear) {
      url += `?year=${filterYear}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setGoals(data);
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/goals/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal),
    });
    if (response.ok) {
      setNewGoal({ title: '', description: '', year: new Date().getFullYear() });
      setIsAddingGoal(false);
      fetchGoals();
    }
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:8000/api/goals/${id}/`, {
      method: 'DELETE',
    }).then(() => setGoals(goals.filter(goal => goal.id !== id)));
  };

  const handleComplete = (goal: Goal) => {
    fetch(`http://localhost:8000/api/goals/${goal.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed: !goal.is_completed }),
    }).then(() => {
      setGoals(goals.map(g =>
        g.id === goal.id ? { ...g, is_completed: !g.is_completed } : g
      ));
    });
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
  };
  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    const response = await fetch(`http://localhost:8000/api/goals/${editingGoal.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingGoal),
    });

    if (response.ok) {
      setGoals(goals.map(g => (g.id === editingGoal.id ? { ...g, ...editingGoal } : g)));
      setEditingGoal(null);
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
              onEdit={() => handleEdit(goal)}
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
            setGoal={setEditingGoal}
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