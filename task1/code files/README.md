# HR Dashboard (Advanced)

A comprehensive HR Performance Dashboard built with React, featuring employee management, performance tracking, analytics, and modern responsive design.

## 🚀 Features

### Core Features
- **Dashboard Homepage** - View all employees with performance ratings and quick actions
- **Advanced Search & Filtering** - Search by name, email, department with multi-select filters
- **Employee Details** - Detailed profiles with tabbed interface (Overview, Projects, Feedback)
- **Bookmark Management** - Save and manage important employees with bulk actions
- **Analytics Dashboard** - Visual charts and performance metrics using Chart.js
- **Create Employee** - Add new employees with form validation

### Advanced Features
- **Dark/Light Mode** - Complete theme switching with Tailwind CSS
- **Responsive Design** - Mobile-first approach, works on all devices
- **State Management** - Context API with useReducer for complex state
- **Custom Hooks** - `useBookmarks`, `useSearch` for modular functionality
- **Loading States** - Proper loading and error handling throughout
- **Keyboard Accessibility** - Modal navigation and focus management
- **Form Validation** - Real-time validation with error messages

## 🔧 Tech Stack

- **React 18** with modern hooks and patterns
- **React Router 6** for client-side routing
- **Tailwind CSS** for styling and responsive design
- **Chart.js** for data visualization
- **Context API + useReducer** for state management
- **Vite** for fast development and building

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Badge.jsx
│   ├── Button.jsx
│   ├── EmployeeCard.jsx
│   ├── Layout.jsx
│   ├── LoadingSpinner.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   ├── SearchAndFilter.jsx
│   ├── StarRating.jsx
│   └── CreateEmployeeModal.jsx
├── context/             # State management
│   └── AppContext.jsx
├── hooks/               # Custom hooks
│   ├── useBookmarks.js
│   └── useSearch.js
├── pages/               # Main application pages
│   ├── Analytics.jsx
│   ├── Bookmarks.jsx
│   ├── Dashboard.jsx
│   └── EmployeeDetails.jsx
├── App.jsx              # Main app component
├── main.jsx             # Application entry point
└── globals.css          # Global styles and utilities
```

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📊 Key Components

### Employee Management
- **Employee Cards** - Display key information with ratings and actions
- **Employee Details** - Comprehensive profile view with tabs
- **Create Employee** - Form with validation for adding new team members

### Search & Filtering
- **Real-time Search** - Filter by name, email, or department
- **Multi-select Filters** - Department and performance rating filters
- **Filter State Management** - Persistent filter state across navigation

### Analytics
- **Department Performance** - Bar chart showing average ratings by department
- **Rating Distribution** - Doughnut chart showing performance spread
- **Bookmark Trends** - Line chart tracking bookmark activity
- **Key Metrics** - Total employees, average rating, top performers

### Bookmarks
- **Quick Access** - Starred employees for easy management
- **Bulk Actions** - Promote all or assign projects to multiple employees
- **Management Tools** - Remove bookmarks and perform actions

## 🎨 Design Features

- **Dark Mode Support** - Complete theme switching with system preference detection
- **Responsive Grid** - Adaptive layouts for mobile, tablet, and desktop
- **Modern UI** - Clean design with proper spacing and typography
- **Loading States** - Skeleton screens and spinners for better UX
- **Error Handling** - Graceful error states with retry options

## 🔧 Development Features

- **Custom Hooks** - Modular logic for bookmarks and search functionality
- **TypeScript Ready** - Easy migration path with proper prop types
- **ESLint Configuration** - Code quality and consistency
- **Hot Module Replacement** - Fast development with Vite
- **PostCSS Integration** - Automated CSS processing

## 🌟 Performance Optimizations

- **Lazy Loading** - Components loaded on demand
- **Memoization** - Optimized re-renders with useMemo and useCallback
- **Efficient State Updates** - Reducer pattern for complex state management
- **Image Optimization** - Placeholder avatars with proper sizing

## 📱 Responsive Breakpoints

- **Mobile** - < 768px (single column layout)
- **Tablet** - 768px - 1024px (two column grid)
- **Desktop** - > 1024px (three column grid)
- **Large Desktop** - > 1280px (optimized spacing)

## 🚀 Future Enhancements

- **Authentication** - Add NextAuth.js for user management
- **Real API Integration** - Replace mock data with actual backend
- **Advanced Charts** - More visualization types and interactivity
- **Drag & Drop** - Reorder employees and manage assignments
- **Export Features** - PDF reports and CSV data export
- **Real-time Updates** - WebSocket integration for live data

---

Built with ❤️ using React and modern web technologies.
