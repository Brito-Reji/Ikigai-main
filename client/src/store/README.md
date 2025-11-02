# Redux Implementation Guide

## Overview
This Redux implementation provides centralized state management for your learning platform application using Redux Toolkit.

## Store Structure

```
src/store/
├── store.js              # Main store configuration
├── slices/
│   ├── authSlice.js      # Authentication state management
│   ├── uiSlice.js        # UI state (modals, sidebar, theme, etc.)
│   └── courseSlice.js    # Course data and operations
└── README.md             # This file
```

## Key Features

### 1. Authentication Slice (`authSlice.js`)
- **User login/logout**
- **Registration with OTP verification**
- **Google OAuth integration**
- **Token management**
- **Auto-fetch current user**

#### Available Actions:
```javascript
// Async actions
dispatch(loginUser({ email, password, role }))
dispatch(registerUser({ userData, role }))
dispatch(verifyOTP({ email, otp }))
dispatch(fetchCurrentUser())
dispatch(googleAuth({ token, role }))

// Sync actions
dispatch(logout())
dispatch(clearError())
dispatch(setRequiresVerification({ email }))
```

#### State Structure:
```javascript
{
  user: null | UserObject,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null,
  requiresVerification: boolean,
  verificationEmail: string | null
}
```

### 2. UI Slice (`uiSlice.js`)
- **Sidebar and mobile menu state**
- **Theme management**
- **Notifications system**
- **Loading states**
- **Modal management**

#### Available Actions:
```javascript
dispatch(toggleSidebar())
dispatch(setMobileMenuOpen(true))
dispatch(addNotification({ type: 'success', message: 'Success!' }))
dispatch(setGlobalLoading(true))
dispatch(openModal({ type: 'confirm', data: { message: 'Are you sure?' } }))
```

### 3. Course Slice (`courseSlice.js`)
- **Course CRUD operations**
- **Search and filtering**
- **Cart and wishlist management**
- **Pagination**

#### Available Actions:
```javascript
// Async actions
dispatch(fetchCourses({ page: 1, search: 'react' }))
dispatch(fetchCourseById(courseId))
dispatch(createCourse(courseData))
dispatch(updateCourse({ courseId, courseData }))
dispatch(deleteCourse(courseId))

// Sync actions
dispatch(addToCart(courseId))
dispatch(addToWishlist(courseId))
dispatch(setFilters({ category: 'programming' }))
```

## Usage Examples

### 1. Using Redux in Components

```javascript
import { useAuth } from '../hooks/useRedux.js';
import { loginUser, clearError } from '../store/slices/authSlice.js';

function LoginComponent() {
  const { isAuthenticated, loading, error, dispatch } = useAuth();

  const handleLogin = async (formData) => {
    dispatch(loginUser({
      email: formData.email,
      password: formData.password,
      role: 'student'
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated]);

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 2. Protected Routes with AuthGuard

```javascript
import AuthGuard from '../components/AuthGuard.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected route - requires authentication */}
      <Route path="/dashboard" element={
        <AuthGuard requireAuth={true}>
          <Dashboard />
        </AuthGuard>
      } />
      
      {/* Role-based protection */}
      <Route path="/admin" element={
        <AuthGuard requireAuth={true} roles={['admin']}>
          <AdminPanel />
        </AuthGuard>
      } />
    </Routes>
  );
}
```

### 3. Course Management

```javascript
import { useCourses } from '../hooks/useRedux.js';
import { fetchCourses, addToCart } from '../store/slices/courseSlice.js';

function CourseList() {
  const { courses, loading, cart, dispatch } = useCourses();

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleAddToCart = (courseId) => {
    dispatch(addToCart(courseId));
  };

  return (
    <div>
      {loading && <div>Loading courses...</div>}
      {courses.map(course => (
        <div key={course._id}>
          <h3>{course.title}</h3>
          <button 
            onClick={() => handleAddToCart(course._id)}
            disabled={cart.includes(course._id)}
          >
            {cart.includes(course._id) ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Migration from Context API

### Before (Context API):
```javascript
const { user, setUser, loading } = useAuth();
```

### After (Redux):
```javascript
const { user, loading, isAuthenticated, dispatch } = useAuth();
```

## Best Practices

1. **Use the custom hooks** (`useAuth`, `useUI`, `useCourses`) instead of raw `useSelector`
2. **Always dispatch actions** instead of directly mutating state
3. **Handle loading and error states** in your components
4. **Use AuthGuard** for protected routes
5. **Clear errors** when appropriate (form field changes, component unmount)

## Error Handling

All async actions automatically handle errors and store them in the respective slice's `error` field:

```javascript
const { error, dispatch } = useAuth();

// Clear errors when needed
useEffect(() => {
  dispatch(clearError());
}, []);

// Display errors in UI
{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

## Performance Considerations

- Redux Toolkit uses Immer internally for immutable updates
- Only components that subscribe to changed state will re-render
- Use `createAsyncThunk` for all API calls to get automatic loading states
- Normalize data when dealing with large lists

## Next Steps

1. Replace existing Context API usage with Redux
2. Add more slices as needed (notifications, settings, etc.)
3. Implement Redux Persist for data persistence
4. Add middleware for API error handling
5. Consider RTK Query for advanced data fetching needs