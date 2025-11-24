import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategory } from "@/hooks/useRedux";
import { createCategory, fetchCategories } from "@/store/slices/categorySlice";

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { categories, loading, error, dispatch } = useCategory();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [currentCategory, setCurrentCategory] = useState({ _id: null, name: "", description: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (categories.length > 0 && categoryId) {
      const category = categories.find(cat => cat._id === categoryId);
      if (category) {
        setSelectedCategory(category);
      } else {
        // Category not found, redirect to categories list
        navigate("/admin/categories");
      }
    }
  }, [categories, categoryId, navigate]);

  // Mock courses data for demonstration
  const mockCourses = [
    { _id: "1", title: "React Fundamentals", instructor: "John Doe", students: 150, status: "active" },
    { _id: "2", title: "Advanced JavaScript", instructor: "Jane Smith", students: 89, status: "active" },
    { _id: "3", title: "Node.js Backend", instructor: "Mike Johnson", students: 67, status: "draft" },
  ];

  const handleBackToList = () => {
    navigate("/admin/categories");
  };

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleUnlist = (_id) => {
    console.log("Unlisting category:", _id);
    setShowSettings(false);
  };

  const handleEdit = (_id) => {
    const category = categories.find(cat => cat._id === _id);
    setModalMode("edit");
    setCurrentCategory(category);
    setErrors({});
    setIsModalOpen(true);
    setShowSettings(false);
  };

  const handleDelete = (_id) => {
    if (window.confirm("⚠️ PERMANENT ACTION: This will permanently delete the category and cannot be undone. Are you absolutely sure?")) {
      console.log("Deleting category:", _id);
      setShowSettings(false);
      // After deletion, navigate back to categories list
      navigate("/admin/categories");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentCategory.name.trim()) {
      newErrors.name = "Category name is required";
    }
    
    if (!currentCategory.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Update category logic here
    console.log("Updating category:", currentCategory);
    
    setIsModalOpen(false);
    setCurrentCategory({ _id: null, name: "", description: "" });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentCategory({ _id: null, name: "", description: "" });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading category...</div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Category not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* GitHub-style top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToList}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </button>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-semibold text-gray-800">{selectedCategory.name}</h1>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              Export
            </button>
            <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors">
              Add Course
            </button>
            <div className="relative">
              <button
                onClick={handleSettings}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleEdit(selectedCategory._id)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Category
                    </button>
                    <button
                      onClick={() => handleUnlist(selectedCategory._id)}
                      className="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                    >
                      Unlist Category
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => handleDelete(selectedCategory._id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete Category
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Description */}
        <p className="text-gray-600 mt-2">{selectedCategory.description}</p>
      </div>

      {/* Courses List */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Courses in this Category</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockCourses.map((course) => (
              <div key={course._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">by {course.instructor}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">{course.students} students</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors">
                      View
                    </button>
                    <button className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {mockCourses.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No courses found in this category.
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Edit Category</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter category name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentCategory.description}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter category description"
                    rows="4"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;