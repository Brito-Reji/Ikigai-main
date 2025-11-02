import React, { useState } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Web Development', description: 'Learn web technologies and frameworks' },
    { id: 2, name: 'Data Science', description: 'Master data analysis and machine learning' },
    { id: 3, name: 'Mobile Development', description: 'Build iOS and Android applications' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '', description: '' });
  const [errors, setErrors] = useState({});

  const handleAddCategory = () => {
    setModalMode('add');
    setCurrentCategory({ id: null, name: '', description: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const category = categories.find(cat => cat.id === id);
    setModalMode('edit');
    setCurrentCategory(category);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleView = (id) => {
    const category = categories.find(cat => cat.id === id);
    alert(`Category: ${category.name}\nDescription: ${category.description}`);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentCategory.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (!currentCategory.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (modalMode === 'add') {
      const newCategory = {
        ...currentCategory,
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1
      };
      setCategories([...categories, newCategory]);
    } else {
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id ? currentCategory : cat
      ));
    }

    setIsModalOpen(false);
    setCurrentCategory({ id: null, name: '', description: '' });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentCategory({ id: null, name: '', description: '' });
    setErrors({});
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Categories Management</h1>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
          <button
            onClick={handleAddCategory}
            className="px-6 py-2 bg-teal-500 text-white font-semibold rounded hover:bg-teal-600 transition-colors"
          >
            Add Category
          </button>
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex justify-between items-center bg-gray-100 px-6 py-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div>
                  <span className="text-gray-800 font-medium text-lg">{category.name}</span>
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleView(category.id)}
                    className="px-6 py-1.5 bg-teal-500 text-white rounded font-medium hover:bg-teal-600 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="px-6 py-1.5 bg-white text-blue-500 border border-blue-500 rounded font-medium hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-5 py-1.5 bg-white text-red-500 border border-red-500 rounded font-medium hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No categories available. Click "Add Category" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter category name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentCategory.description}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter category description"
                    rows="4"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
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
                  {modalMode === 'add' ? 'Add Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
