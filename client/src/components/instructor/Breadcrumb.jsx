import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define breadcrumb mappings for instructor routes
  const breadcrumbMap = {
    '/instructor/dashboard': [
      { label: 'Dashboard', path: '/instructor/dashboard', isLast: true }
    ],
    '/instructor/courses': [
      { label: 'Dashboard', path: '/instructor/dashboard' },
      { label: 'Courses', path: '/instructor/courses', isLast: true }
    ],
    '/instructor/courses/create': [
      { label: 'Dashboard', path: '/instructor/dashboard' },
      { label: 'Courses', path: '/instructor/courses' },
      { label: 'Add New Course', path: '/instructor/courses/create', isLast: true }
    ],
    '/instructor/communication': [
      { label: 'Dashboard', path: '/instructor/dashboard' },
      { label: 'Communication', path: '/instructor/communication', isLast: true }
    ],
    '/instructor/revenue': [
      { label: 'Dashboard', path: '/instructor/dashboard' },
      { label: 'Revenue', path: '/instructor/revenue', isLast: true }
    ],
    '/instructor/settings': [
      { label: 'Dashboard', path: '/instructor/dashboard' },
      { label: 'Settings', path: '/instructor/settings', isLast: true }
    ]
  };

  // Handle dynamic routes (like /instructor/courses/:courseId and /instructor/courses/:courseId/edit)
  const getBreadcrumbs = () => {
    const currentPath = location.pathname;
    
    // Check for exact match first
    if (breadcrumbMap[currentPath]) {
      return breadcrumbMap[currentPath];
    }
    
    // Handle dynamic routes
    if (currentPath.startsWith('/instructor/courses/') && currentPath !== '/instructor/courses/create') {
      const pathParts = currentPath.split('/');
      const courseId = pathParts[3];
      const action = pathParts[4]; // 'edit' or undefined
      
      if (action === 'edit') {
        return [
          { label: 'Dashboard', path: '/instructor/dashboard' },
          { label: 'Courses', path: '/instructor/courses' },
          { label: 'Edit Course', path: currentPath, isLast: true }
        ];
      } else {
        return [
          { label: 'Dashboard', path: '/instructor/dashboard' },
          { label: 'Courses', path: '/instructor/courses' },
          { label: 'Course Details', path: currentPath, isLast: true }
        ];
      }
    }
    
    // Default fallback
    return [
      { label: 'Dashboard', path: '/instructor/dashboard', isLast: true }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-8 py-4 border-b border-gray-200 fixed top-0 left-64 right-0 z-30">
      <button
        onClick={() => navigate('/instructor/dashboard')}
        className="hover:text-gray-900 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {crumb.isLast ? (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          ) : (
            <button
              onClick={() => navigate(crumb.path)}
              className="hover:text-gray-900 transition-colors"
            >
              {crumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;