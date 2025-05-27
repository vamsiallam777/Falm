import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from './Button';
import Badge from './Badge';
import StarRating from './StarRating';

const EmployeeCard = ({ employee }) => {
  const { bookmarks, addBookmark, removeBookmark, promoteEmployee } = useApp();
  const isBookmarked = bookmarks.includes(employee.id);

  const getPerformanceBadge = (rating) => {
    if (rating >= 4.5) return { variant: 'excellent', label: 'Excellent' };
    if (rating >= 3.5) return { variant: 'good', label: 'Good' };
    if (rating >= 2.5) return { variant: 'average', label: 'Average' };
    return { variant: 'poor', label: 'Needs Improvement' };
  };

  const performance = getPerformanceBadge(employee.rating);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmark(employee.id);
    } else {
      addBookmark(employee.id);
    }
  };

  const handlePromote = () => {
    promoteEmployee(employee.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow animate-fade-in">
      <div className="flex items-start space-x-4">
        <img
          src={employee.image}
          alt={`${employee.firstName} ${employee.lastName}`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {employee.firstName} {employee.lastName}
                {employee.promoted && (
                  <Badge variant="promoted" className="ml-2">
                    Promoted ⭐
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {employee.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {employee.department} • Age {employee.age}
              </p>
            </div>
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center space-x-2">
              <StarRating rating={employee.rating} size="sm" />
              <Badge variant={performance.variant}>
                {performance.label}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {employee.projects} projects • Joined {new Date(employee.joinDate).getFullYear()}
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Link to={`/employee/${employee.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Button
              variant="success"
              size="sm"
              onClick={handlePromote}
              disabled={employee.promoted}
            >
              {employee.promoted ? 'Promoted' : 'Promote'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;