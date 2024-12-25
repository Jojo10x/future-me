import { useState, useEffect } from 'react';
import { Goal, NewGoal } from '@/types/types';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filterYear, setFilterYear] = useState<number | string>('');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [newGoal, setNewGoal] = useState<Partial<NewGoal>>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    subtasks: []
  });

  useEffect(() => {
    fetchGoals();
  }, [filterYear]);

  const fetchGoals = async () => {
    try {
      let url = 'http://localhost:8000/api/goals/';
      if (filterYear) url += `?year=${filterYear}`;
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
      const goalData = {
        title: newGoal.title,
        description: newGoal.description || '',
        year: newGoal.year,
        is_completed: false,
        subtasks: newGoal.subtasks?.map((subtask, index) => ({
          id: -1 * (index + 1), 
          title: subtask.title,
          is_completed: false,
          goalId: -1 
        })) || []
      };
  
      const response = await fetch('http://localhost:8000/api/goals/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: goalData.title,
          description: goalData.description,
          year: goalData.year,
          is_completed: goalData.is_completed,
          subtasks: goalData.subtasks.map(st => ({
            title: st.title,
            is_completed: st.is_completed
          }))
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add goal');
      }
  
   
      setNewGoal({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        subtasks: []
      });
      
      setIsAddingGoal(false);
      fetchGoals(); 
      setSnackbarMessage("Goal added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding goal:', error);
      setSnackbarMessage("Failed to add goal");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      if (error instanceof Error) {
        alert(`Failed to add goal: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/goals/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals(goals.filter(goal => goal.id !== id));
      setSnackbarMessage("Goal deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting goal:', error);
      setSnackbarMessage("Failed to delete goal");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      if (error instanceof Error) {
        alert(`Failed to delete goal: ${error.message}`);
      }
    }
  };

  const handleComplete = async (goal: Goal) => {
    try {
      setGoals(goals.map(g =>
        g.id === goal.id ? { ...g, is_completed: !g.is_completed } : g
      ));
  
      const response = await fetch(`http://localhost:8000/api/goals/${goal.id}/toggle_completion/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error('Failed to toggle goal completion');
      }
  
      await fetchGoals();
      setSnackbarMessage("Goal completion toggled successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error toggling goal completion:', error);
      await fetchGoals();
      setSnackbarMessage("Failed to toggle goal completion");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      if (error instanceof Error) {
        alert(`Failed to toggle goal completion: ${error.message}`);
      }
    }
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal?.id) return;
  
    try {
      const updatePayload = {
        title: editingGoal.title,
        description: editingGoal.description,
        year: editingGoal.year,
        is_completed: editingGoal.is_completed,
        subtasks: editingGoal.subtasks.map(subtask => ({
          id: subtask.id,
          title: subtask.title,
          is_completed: subtask.is_completed,
          ...(subtask.id > 0 ? { id: subtask.id } : {})
        }))
      };
  
      const response = await fetch(`http://localhost:8000/api/goals/${editingGoal.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update goal');
      }

      const updatedGoal = await response.json();
 
      setGoals(goals.map(g => (g.id === editingGoal.id ? updatedGoal : g)));
      setEditingGoal(null);
      setSnackbarMessage("Goal updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating goal:', error);
      setSnackbarMessage("Failed to update goal");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      if (error instanceof Error) {
        alert(`Failed to update goal: ${error.message}`);
      }
    }
  };

  const handleSubtaskComplete = async (goalId: number, subtaskId: number) => {
    try {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;

      const updatedSubtasks = goal.subtasks.map((st) => ({
        ...st,
        is_completed: st.id === subtaskId ? !st.is_completed : st.is_completed,
      }));

      const allSubtasksCompleted = updatedSubtasks.every(
        (st) => st.is_completed
      );

      setGoals(
        goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                subtasks: updatedSubtasks,
                is_completed: allSubtasksCompleted,
              }
            : g
        )
      );

      const response = await fetch(
        `http://localhost:8000/api/goals/${goalId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subtasks: updatedSubtasks.map((st) => ({
              id: st.id,
              title: st.title,
              is_completed: st.is_completed,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subtask");
      }

      fetchGoals();
      setSnackbarMessage("Subtask updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating subtask:", error);
      setSnackbarMessage("Failed to update subtask");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      fetchGoals();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return {
    goals,
    filterYear,
    setFilterYear,
    newGoal,
    setNewGoal,
    isAddingGoal,
    setIsAddingGoal,
    editingGoal,
    setEditingGoal,
    fetchGoals,
    handleAddGoal,
    handleDelete,
    handleComplete,
    handleUpdateGoal,
    handleSubtaskComplete,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
  };
}
