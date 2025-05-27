import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import EmployeeCard from '../components/EmployeeCard';
import SearchAndFilter from '../components/SearchAndFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateEmployeeModal from '../components/CreateEmployeeModal';
import Button from '../components/Button';

const Dashboard = () => {  const { 
    employees, 
    loading, 
    error, 
    fetchEmployees, 
    getFilteredEmployees,
    addEmployee
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const filteredEmployees = getFilteredEmployees;
  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [employees.length, fetchEmployees]);

  if (loading) {
    return <LoadingSpinner text="Loading employees..." />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchEmployees}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            HR Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team and track performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredEmployees.length} of {employees.length} employees
          </div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            + Add Employee
          </Button>
        </div>
      </div>

      <SearchAndFilter />

      {filteredEmployees.length === 0 ? (
        <div className="text-center p-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <span className="text-6xl">👥</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No employees found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map(employee => (
            <EmployeeCard key={employee.id} employee={employee} />          ))}
        </div>
      )}

      <CreateEmployeeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEmployee={addEmployee}
      />
    </div>
  );
};

export default Dashboard;