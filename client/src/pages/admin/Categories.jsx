import { useCategory } from '@/hooks/useRedux';
import { createCategory, fetchCategories } from '@/store/slices/categorySlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const { categories, loading, error, dispatch } = useCategory();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState({ _id: null, name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCategory = () => {
    setModalMode('add');
    setCurrentCategory({ _id: null, name: '', description: '' });
    setErrors({});
    setIsModalOpen(true);
  };



  const handleUnlist = (_id) => {
    // Toggle category status
    console.log('Unlisting category:', _id);
    // Add your unlist logic here
  };

  const handleView = (_id) => {
    navigate(`/admin/categories/${_id}`);
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
       
      };
      console.log(newCategory)
      dispatch(createCategory(newCategory))
    } else {
      setCategories(categories.map(cat => 
        cat._id === currentCategory._id ? currentCategory : cat
      ));
    }

    setIsModalOpen(false);
    setCurrentCategory({ _id: null, name: '', description: '' });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentCategory({ _id: null, name: '', description: '' });
    setErrors({});
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category._id}
                className="flex justify-between items-center bg-gray-100 px-6 py-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div>
                  <span className="text-gray-800 font-medium text-lg">{category.name}</span>
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleView(category._id)}
                    className="px-6 py-1.5 bg-teal-500 text-white rounded font-medium hover:bg-teal-600 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUnlist(category._id)}
                    className="px-5 py-1.5 bg-white text-orange-500 border border-orange-500 rounded font-medium hover:bg-orange-50 transition-colors"
                  >
                    Unlist
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? (
                <>
                  No categories found matching "{searchTerm}".
                  <br />
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-teal-500 hover:text-teal-600 underline mt-2"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                'No categories available. Click "Add Category" to create one.'
              )}
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
