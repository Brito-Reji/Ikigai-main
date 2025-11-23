import { useCategory } from '@/hooks/useRedux';
import { createCategory, toggleCategoryBlock } from '@/store/slices/categorySlice';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/api/axiosConfig.js';
import Swal from 'sweetalert2';

const Categories = () => {
  const { dispatch } = useCategory();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentCategory, setCurrentCategory] = useState({ _id: null, name: '', description: '' });
  const [errors, setErrors] = useState({});
  
  // Pagination state with URL sync
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Fetch categories
  const fetchCategoriesData = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5'
      });
      
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/public?${params.toString()}`);
      
      if (response.data.success) {
        setCategories(response.data.categories);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setModalMode('add');
    setCurrentCategory({ _id: null, name: '', description: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleUnlist = async (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    const action = category?.isBlocked ? 'unblock' : 'block';
    
    const result = await Swal.fire({
      title: `${action === 'block' ? 'Block' : 'Unblock'} this category?`,
      text: `Are you sure you want to ${action} this category?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'block' ? '#f97316' : '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await dispatch(toggleCategoryBlock(categoryId)).unwrap();
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || 'Category status updated successfully',
          confirmButtonColor: '#14b8a6',
          timer: 2000
        });
        
        // Refresh categories
        fetchCategoriesData(currentPage);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error || 'Failed to update category status',
          confirmButtonColor: '#ef4444'
        });
      }
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (modalMode === 'add') {
      const newCategory = {
        ...currentCategory,
      };
      await dispatch(createCategory(newCategory));
      fetchCategoriesData(currentPage);
    }

    setIsModalOpen(false);
    setCurrentCategory({ _id: null, name: '', description: '' });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentCategory({ _id: null, name: '', description: '' });
    setErrors({});
  };

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params);
  }, [searchTerm, currentPage, setSearchParams]);

  // Fetch categories when filters change
  useEffect(() => {
    fetchCategoriesData(currentPage);
  }, [searchTerm, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (pagination.hasPrev) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (pagination.hasNext) setCurrentPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const totalPages = pagination.totalPages || 1;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
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

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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

        {/* Stats */}
        <div className="mb-6 text-sm text-gray-600">
          {pagination.totalCategories > 0 && (
            <>Showing {((currentPage - 1) * 5) + 1} to {Math.min(currentPage * 5, pagination.totalCategories)} of {pagination.totalCategories} categories</>
          )}
        </div>

        {/* Category List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading categories...</div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
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
                    className={`px-5 py-1.5 rounded font-medium transition-colors ${
                      category.isBlocked
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    {category.isBlocked ? 'Unblock' : 'Block'}
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={!pagination.hasPrev}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !pagination.hasPrev
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum, index) =>
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-teal-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!pagination.hasNext}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !pagination.hasNext
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
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
