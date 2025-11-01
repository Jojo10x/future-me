import { Goal } from "@/types/types";
import { useState, useMemo } from "react";
import { YearFilter } from "../Year/YearFilter";

export const GoalView = ({ goals }: { goals: Goal[] }) => {
  const [filterYear, setFilterYear] = useState<number | string>(new Date().getFullYear());
  const [sortField, setSortField] = useState<'created_at' | 'title' | 'subtasks'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredGoals = useMemo(() => {
    if (filterYear === "") return goals;
    return goals.filter(goal => goal.year === filterYear);
  }, [goals, filterYear]);

  const sortedGoals = useMemo(() => {
    return [...filteredGoals].sort((a, b) => {
      if (sortField === 'created_at') {
        return sortOrder === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortField === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortOrder === 'asc'
          ? a.subtasks.length - b.subtasks.length
          : b.subtasks.length - a.subtasks.length;
      }
    });
  }, [filteredGoals, sortField, sortOrder]);

  const toggleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (field !== sortField) return null;
    return (
      <span className="ml-1">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <YearFilter
        filterYear={filterYear}
        goals={goals}
        setFilterYear={setFilterYear}
      />
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Detailed Goal Analysis
            {filterYear && <span className="ml-2 text-sm text-gray-500">({filterYear})</span>}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('title')}
                >
                  <span className="flex items-center">
                    Title <SortIcon field="title" />
                  </span>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('created_at')}
                >
                  <span className="flex items-center">
                    Created <SortIcon field="created_at" />
                  </span>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('subtasks')}
                >
                  <span className="flex items-center">
                    Subtasks <SortIcon field="subtasks" />
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedGoals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No goals found {filterYear && `for ${filterYear}`}
                  </td>
                </tr>
              ) : (
                sortedGoals.map((goal) => {
                  const completedSubtasks = goal.subtasks.filter(t => t.is_completed).length;
                  const progressPercentage = goal.subtasks.length 
                    ? (completedSubtasks / goal.subtasks.length) * 100 
                    : goal.is_completed ? 100 : 0;

                  return (
                    <tr key={goal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {goal.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(goal.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {completedSubtasks}/{goal.subtasks.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          goal.is_completed 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {goal.is_completed ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoalView;