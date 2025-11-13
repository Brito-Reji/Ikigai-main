# Loader Components Usage Guide

## 1. LoadingScreen (Full Page)
Use ONLY for initial app load when checking authentication.

**Already implemented in:** `App.jsx`

```jsx
import LoadingScreen from "./components/LoadingScreen.jsx";

// Shows while checking if user is logged in on app start
if (isLoading) {
  return <LoadingScreen />;
}
```

---

## 2. ThreeDotLoader (Data Fetching)
Use for API calls, data fetching, and loading states.

**Already implemented in:** `AuthGuard.jsx`

### Import
```jsx
import ThreeDotLoader from "./components/ThreeDotLoader.jsx";
```

### Basic Usage
```jsx
{loading && <ThreeDotLoader />}
```

### Sizes
```jsx
<ThreeDotLoader size="sm" />   // Small
<ThreeDotLoader size="md" />   // Medium (default)
<ThreeDotLoader size="lg" />   // Large
```

### Colors
```jsx
<ThreeDotLoader color="indigo" />  // Indigo (default)
<ThreeDotLoader color="purple" />  // Purple
<ThreeDotLoader color="gray" />    // Gray
<ThreeDotLoader color="white" />   // White (for dark backgrounds)
```

### Example: Course Listing with Loading
```jsx
import { useState, useEffect } from "react";
import ThreeDotLoader from "@/components/ThreeDotLoader";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThreeDotLoader size="lg" color="indigo" />
      </div>
    );
  }

  return (
    <div>
      {/* Course content */}
    </div>
  );
}
```

### Example: Button Loading State
```jsx
<button 
  disabled={loading}
  className="px-4 py-2 bg-indigo-600 text-white rounded"
>
  {loading ? (
    <ThreeDotLoader size="sm" color="white" />
  ) : (
    "Submit"
  )}
</button>
```

### Example: Inline Loading
```jsx
<div className="flex items-center space-x-2">
  <span>Loading courses</span>
  <ThreeDotLoader size="sm" />
</div>
```

---

## When to Use Each Loader

### ✅ Use LoadingScreen for:
- Initial app load (checking authentication)
- First-time app initialization

### ✅ Use ThreeDotLoader for:
- Fetching courses/data from API
- Form submissions
- Button loading states
- Page transitions with data loading
- Search results loading
- Filter/sort operations

### ❌ Don't use loaders for:
- Static content
- Instant UI updates
- Navigation without data fetching
- Simple state changes
