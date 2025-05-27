import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const SearchAndFilter = () => {
  const {
    searchTerm,
    selectedDepartments,
    selectedRatings,
    setSearchTerm,
    setSelectedDepartments,
    setSelectedRatings,
    employees
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);

  const departments = [...new Set(employees.map(emp => emp.department))].sort();
  const ratings = [1, 2, 3, 4, 5];

  const handleDepartmentChange = (department) => {
    const updated = selectedDepartments.includes(department)
      ? selectedDepartments.filter(d => d !== department)
      : [...selectedDepartments, department];
    setSelectedDepartments(updated);
  };

  const handleRatingChange = (rating) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updated);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartments([]);
    setSelectedRatings([]);
  };

  const hasActiveFilters = searchTerm || selectedDepartments.length > 0 || selectedRatings.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            🔧 Filters {hasActiveFilters && `(${selectedDepartments.length + selectedRatings.length})`}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Departments</h3>
              <div className="space-y-2">
                {departments.map(department => (
                  <label key={department} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDepartments.includes(department)}
                      onChange={() => handleDepartmentChange(department)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{department}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Performance Rating</h3>
              <div className="space-y-2">
                {ratings.map(rating => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => handleRatingChange(rating)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {rating} Star{rating !== 1 ? 's' : ''} & Above
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;