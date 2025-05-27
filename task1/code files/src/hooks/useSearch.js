import { useApp } from '../context/AppContext';

export const useSearch = () => {
  const {
    searchTerm,
    selectedDepartments,
    selectedRatings,
    setSearchTerm,
    setSelectedDepartments,
    setSelectedRatings,
    getFilteredEmployees,
    employees,
  } = useApp();

  const filteredEmployees = getFilteredEmployees;
  
  const departments = [...new Set(employees.map(emp => emp.department))].sort();
  const ratings = [1, 2, 3, 4, 5];

  const hasActiveFilters = searchTerm || selectedDepartments.length > 0 || selectedRatings.length > 0;
  const activeFilterCount = selectedDepartments.length + selectedRatings.length;

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDepartments([]);
    setSelectedRatings([]);
  };

  const toggleDepartment = (department) => {
    const updated = selectedDepartments.includes(department)
      ? selectedDepartments.filter(d => d !== department)
      : [...selectedDepartments, department];
    setSelectedDepartments(updated);
  };

  const toggleRating = (rating) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updated);
  };

  return {
    searchTerm,
    selectedDepartments,
    selectedRatings,
    filteredEmployees,
    departments,
    ratings,
    hasActiveFilters,
    activeFilterCount,
    setSearchTerm,
    setSelectedDepartments,
    setSelectedRatings,
    clearAllFilters,
    toggleDepartment,
    toggleRating,
  };
};