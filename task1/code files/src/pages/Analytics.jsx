import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { employees, bookmarks } = useApp();

  // Calculate department-wise average ratings
  const getDepartmentStats = () => {
    const departmentData = {};
    
    employees.forEach(emp => {
      if (!departmentData[emp.department]) {
        departmentData[emp.department] = { total: 0, count: 0, employees: [] };
      }
      departmentData[emp.department].total += emp.rating;
      departmentData[emp.department].count += 1;
      departmentData[emp.department].employees.push(emp);
    });

    return Object.entries(departmentData).map(([dept, data]) => ({
      department: dept,
      averageRating: (data.total / data.count).toFixed(2),
      employeeCount: data.count,
      employees: data.employees
    }));
  };

  const departmentStats = getDepartmentStats();

  // Bar chart data for department performance
  const departmentChartData = {
    labels: departmentStats.map(stat => stat.department),
    datasets: [
      {
        label: 'Average Performance Rating',
        data: departmentStats.map(stat => parseFloat(stat.averageRating)),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Rating distribution data
  const getRatingDistribution = () => {
    const distribution = { excellent: 0, good: 0, average: 0, poor: 0 };
    
    employees.forEach(emp => {
      if (emp.rating >= 4.5) distribution.excellent++;
      else if (emp.rating >= 3.5) distribution.good++;
      else if (emp.rating >= 2.5) distribution.average++;
      else distribution.poor++;
    });

    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  const ratingChartData = {
    labels: ['Excellent (4.5+)', 'Good (3.5-4.4)', 'Average (2.5-3.4)', 'Poor (<2.5)'],
    datasets: [
      {
        data: [
          ratingDistribution.excellent,
          ratingDistribution.good,
          ratingDistribution.average,
          ratingDistribution.poor,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Mock bookmark trends data
  const bookmarkTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Bookmarks Added',
        data: [12, 19, 15, 25, 22, bookmarks.length],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Calculate key metrics
  const totalEmployees = employees.length;
  const averageRating = employees.length > 0 
    ? (employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length).toFixed(2)
    : 0;
  const topPerformers = employees.filter(emp => emp.rating >= 4.5).length;
  const promotedEmployees = employees.filter(emp => emp.promoted).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Performance insights and team metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                👥
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Employees
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {totalEmployees}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                ⭐
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Average Rating
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {averageRating}/5.0
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-yellow-500 text-white">
                🏆
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Top Performers
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {topPerformers}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-500 text-white">
                📌
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Bookmarked
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {bookmarks.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Department Performance
          </h3>
          <div className="h-64">
            <Bar data={departmentChartData} options={chartOptions} />
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={ratingChartData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Bookmark Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Bookmark Trends
        </h3>
        <div className="h-64">
          <Line data={bookmarkTrendsData} options={lineOptions} />
        </div>
      </div>

      {/* Department Details Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Department Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avg Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Top Performer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {departmentStats.map((stat) => {
                const topPerformer = stat.employees.reduce((prev, current) => 
                  prev.rating > current.rating ? prev : current
                );
                
                return (
                  <tr key={stat.department}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {stat.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {stat.employeeCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {stat.averageRating}/5.0
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {topPerformer.firstName} {topPerformer.lastName} ({topPerformer.rating})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;