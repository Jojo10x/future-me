"use client"
import { Header } from '@/components/Header';
import { YearFilter } from '@/components/YearFilter';
import {GoalForm} from '@/components/GoalForm';
import SnackbarMessage from "@/components/SnackbarMessage";
import GoalList from '@/components/GoalList';
import { useGoals } from '@/hooks/useGoals';
import Footer from '@/components/Footer';

export default function Home() {
  const {
    goals,
    filterYear,
    setFilterYear,
    newGoal,
    setNewGoal,
    isAddingGoal,
    setIsAddingGoal,
    editingGoal,
    setEditingGoal,
    handleAddGoal,
    handleDelete,
    handleComplete,
    handleUpdateGoal,
    handleSubtaskComplete,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
  } = useGoals();

  return (
    <div className="min-h-screen  classit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header goals={goals} onAddGoal={() => setIsAddingGoal(true)} />
        <YearFilter filterYear={filterYear} setFilterYear={setFilterYear} goals={goals} />

        <GoalList
          goals={goals}
          onDelete={handleDelete}
          onComplete={handleComplete}
          onEdit={setEditingGoal}
          onSubtaskComplete={handleSubtaskComplete}
        />

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
   <SnackbarMessage
          snackbarOpen={snackbarOpen}
          snackbarSeverity={snackbarSeverity}
          snackbarMessage={snackbarMessage}
          handleSnackbarClose={handleSnackbarClose}
        />
      </div>
      <Footer/>
    </div>
  );
}