import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Badge from '../components/Badge';
import StarRating from '../components/StarRating';

const Bookmarks = () => {
  const { removeBookmark, promoteEmployee, getBookmarkedEmployees } = useApp();
  const bookmarkedEmployees = getBookmarkedEmployees;

  const getPerformanceBadge = (rating) => {
    if (rating >= 4.5) return { variant: 'excellent', label: 'Excellent' };
    if (rating >= 3.5) return { variant: 'good', label: 'Good' };
    if (rating >= 2.5) return { variant: 'average', label: 'Average' };
    return { variant: 'poor', label: 'Needs Improvement' };
  };

  const handleRemoveBookmark = (employeeId) => {
    removeBookmark(employeeId);
  };

  const handlePromote = (employeeId) => {
    promoteEmployee(employeeId);
  };

  const handleAssignProject = (employeeId) => {
    // Mock action
    alert(`Project assigned to employee ${employeeId}`);
  };

  if (bookmarkedEmployees.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <span className="text-6xl">📌</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Bookmarked Employees
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start bookmarking employees from the dashboard to manage them here.
        </p>
        <Link to="/">
          <Button variant="primary">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bookmarked Employees
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your starred team members
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {bookmarkedEmployees.length} bookmarked
        </div>
      </div>

      <div className="space-y-4">
        {bookmarkedEmployees.map(employee => {
          const performance = getPerformanceBadge(employee.rating);
          
          return (
            <div key={employee.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={employee.image}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      {employee.promoted && (
                        <Badge variant="promoted">Promoted ⭐</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{employee.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {employee.department} • Age {employee.age}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <StarRating rating={employee.rating} size="sm" />
                      <Badge variant={performance.variant}>{performance.label}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link to={`/employee/${employee.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handlePromote(employee.id)}
                    disabled={employee.promoted}
                  >
                    {employee.promoted ? 'Promoted' : 'Promote'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAssignProject(employee.id)}
                  >
                    Assign Project
                  </Button>
                  <button
                    onClick={() => handleRemoveBookmark(employee.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove bookmark"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          💡 Quick Actions
        </h3>
        <p className="text-blue-700 dark:text-blue-300 mb-4">
          Use bookmarks to quickly access your most important team members and perform bulk actions.
        </p>
        <div className="space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              bookmarkedEmployees.forEach(emp => {
                if (!emp.promoted) promoteEmployee(emp.id);
              });
            }}
          >
            Promote All Eligible
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alert(`Projects assigned to all ${bookmarkedEmployees.length} bookmarked employees`);
            }}
          >
            Assign Projects to All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;