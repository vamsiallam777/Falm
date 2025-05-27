import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext();

const initialState = {
  employees: [],
  bookmarks: [],
  searchTerm: '',
  selectedDepartments: [],
  selectedRatings: [],
  loading: false,
  error: null,
  darkMode: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_BOOKMARK':
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.payload],
      };
    case 'REMOVE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.filter(id => id !== action.payload),
      };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_DEPARTMENTS':
      return { ...state, selectedDepartments: action.payload };
    case 'SET_SELECTED_RATINGS':
      return { ...state, selectedRatings: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };    case 'PROMOTE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload
            ? { ...emp, promoted: true, rating: Math.min(emp.rating + 0.5, 5) }
            : emp
        ),
      };
    case 'ADD_EMPLOYEE':
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);
  const fetchEmployees = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('https://dummyjson.com/users?limit=20');
      const data = await response.json();
      
      const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
      
      const enrichedEmployees = data.users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        image: user.image,
        address: user.address,
        company: user.company,
        department: departments[Math.floor(Math.random() * departments.length)],
        rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
        projects: Math.floor(Math.random() * 15) + 1,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0],
        bio: `${user.firstName} is a dedicated professional with expertise in their field.`,
        promoted: false,
      }));
      
      dispatch({ type: 'SET_EMPLOYEES', payload: enrichedEmployees });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);
  const addBookmark = useCallback((employeeId) => {
    if (!state.bookmarks.includes(employeeId)) {
      dispatch({ type: 'ADD_BOOKMARK', payload: employeeId });
    }
  }, [state.bookmarks]);

  const removeBookmark = useCallback((employeeId) => {
    dispatch({ type: 'REMOVE_BOOKMARK', payload: employeeId });
  }, []);

  const setSearchTerm = useCallback((term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const setSelectedDepartments = useCallback((departments) => {
    dispatch({ type: 'SET_SELECTED_DEPARTMENTS', payload: departments });
  }, []);

  const setSelectedRatings = useCallback((ratings) => {
    dispatch({ type: 'SET_SELECTED_RATINGS', payload: ratings });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  const promoteEmployee = useCallback((employeeId) => {
    dispatch({ type: 'PROMOTE_EMPLOYEE', payload: employeeId });
  }, []);

  const addEmployee = useCallback((employee) => {
    dispatch({ type: 'ADD_EMPLOYEE', payload: employee });
  }, []);
  const getFilteredEmployees = useMemo(() => {
    return state.employees.filter(employee => {
      const matchesSearch = !state.searchTerm || 
        employee.firstName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(state.searchTerm.toLowerCase());

      const matchesDepartment = state.selectedDepartments.length === 0 ||
        state.selectedDepartments.includes(employee.department);

      const matchesRating = state.selectedRatings.length === 0 ||
        state.selectedRatings.some(rating => {
          const empRating = Math.floor(employee.rating);
          return empRating === rating;
        });

      return matchesSearch && matchesDepartment && matchesRating;
    });
  }, [state.employees, state.searchTerm, state.selectedDepartments, state.selectedRatings]);

  const getBookmarkedEmployees = useMemo(() => {
    return state.employees.filter(emp => state.bookmarks.includes(emp.id));
  }, [state.employees, state.bookmarks]);  const value = useMemo(() => ({
    ...state,
    fetchEmployees,
    addBookmark,
    removeBookmark,
    setSearchTerm,
    setSelectedDepartments,
    setSelectedRatings,
    toggleDarkMode,
    promoteEmployee,
    addEmployee,
    getFilteredEmployees,
    getBookmarkedEmployees,
  }), [
    state,
    fetchEmployees,
    addBookmark,
    removeBookmark,
    setSearchTerm,
    setSelectedDepartments,
    setSelectedRatings,
    toggleDarkMode,
    promoteEmployee,
    addEmployee,
    getFilteredEmployees,
    getBookmarkedEmployees
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};