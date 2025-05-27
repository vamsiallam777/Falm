import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Badge from '../components/Badge';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';

const EmployeeDetails = () => {
  const { id } = useParams();
  const { employees, bookmarks, addBookmark, removeBookmark, promoteEmployee } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [feedback, setFeedback] = useState('');

  const employee = employees.find(emp => emp.id === parseInt(id));
  const isBookmarked = bookmarks.includes(parseInt(id));

  if (!employee) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <span className="text-6xl">👤</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Employee Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The employee you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

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

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert('Feedback submitted successfully!');
    setFeedback('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
  ];

  const mockProjects = [
    { name: 'Website Redesign', status: 'In Progress', deadline: '2024-02-15', completion: 75 },
    { name: 'Mobile App Development', status: 'Planning', deadline: '2024-03-01', completion: 25 },
    { name: 'Database Migration', status: 'Completed', deadline: '2024-01-20', completion: 100 },
  ];

  const mockFeedbackHistory = [
    { date: '2024-01-15', from: 'Sarah Johnson', text: 'Excellent work on the Q4 project delivery.' },
    { date: '2024-01-10', from: 'Mike Chen', text: 'Great collaboration and communication skills.' },
    { date: '2023-12-20', from: 'Lisa Rodriguez', text: 'Shows strong leadership potential.' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <Link to="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <img
            src={employee.image}
            alt={`${employee.firstName} ${employee.lastName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {employee.firstName} {employee.lastName}
              </h1>
              {employee.promoted && (
                <Badge variant="promoted">Promoted ⭐</Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">{employee.email}</p>
            <p className="text-gray-500 dark:text-gray-500 mb-3">
              {employee.department} • Age {employee.age} • Joined {new Date(employee.joinDate).getFullYear()}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <StarRating rating={employee.rating} />
              <Badge variant={performance.variant}>{performance.label}</Badge>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="success"
                onClick={handlePromote}
                disabled={employee.promoted}
              >
                {employee.promoted ? 'Promoted' : 'Promote'}
              </Button>
              <Button variant="outline">
                Assign Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <p className="text-gray-900 dark:text-white">{employee.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                    <p className="text-gray-900 dark:text-white">
                      {employee.address.address}, {employee.address.city}, {employee.address.state}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Professional Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{employee.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{employee.projects}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Performance Rating</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{employee.rating.toFixed(1)}/5</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Years at Company</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date().getFullYear() - new Date(employee.joinDate).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Current & Recent Projects
              </h3>
              {mockProjects.map((project, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                    <Badge variant={project.status === 'Completed' ? 'excellent' : project.status === 'In Progress' ? 'good' : 'average'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {project.completion}% complete
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Submit Feedback
                </h3>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                  <Button type="submit" variant="primary">
                    Submit Feedback
                  </Button>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Feedback
                </h3>
                <div className="space-y-4">
                  {mockFeedbackHistory.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.from}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;