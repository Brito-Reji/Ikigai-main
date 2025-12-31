import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "@/components/ui/SearchableSelect.jsx";
import ImageUpload from "@/components/ui/ImageUpload.jsx";
import { useCreateCourse } from "@/hooks/useCourses.js";
import { useCategories } from "@/hooks/useCategories.js";
import Swal from "sweetalert2";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCourse();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.categories || [];
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    overview: "",
    actualPrice: "",
    discountType: "none",
    discountValue: "",
    price: "",
    thumbnail: "",
    published: false,
  });



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleThumbnailChange = (url) => {
    setFormData({ ...formData, thumbnail: url });
    if (errors.thumbnail) {
      setErrors({ ...errors, thumbnail: "" });
    }
  };

  // Calculate final price based on discount
  useEffect(() => {
    if (formData.actualPrice && formData.discountType !== "none" && formData.discountValue) {
      let finalPrice = parseFloat(formData.actualPrice);

      if (formData.discountType === "percentage") {
        const discount = (finalPrice * parseFloat(formData.discountValue)) / 100;
        finalPrice = finalPrice - discount;
      } else if (formData.discountType === "fixed") {
        finalPrice = finalPrice - parseFloat(formData.discountValue);
      }

      setFormData(prev => ({ ...prev, price: Math.round(finalPrice) }));
    } else if (formData.actualPrice) {
      setFormData(prev => ({ ...prev, price: Math.round(parseFloat(formData.actualPrice)) }));
    }
  }, [formData.actualPrice, formData.discountType, formData.discountValue]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.title.trim()) newErrors.title = "Please add a course title";
    if (formData.title.length > 200) newErrors.title = "Title is too long (max 200 characters)";
    if (!formData.description.trim()) newErrors.description = "Please add a description";
    if (formData.description.length > 2000) newErrors.description = "Description is too long (max 2000 characters)";
    if (!formData.overview.trim()) newErrors.overview = "Please add an overview";
    if (formData.overview.length > 1000) newErrors.overview = "Overview is too long (max 1000 characters)";
    if (!formData.actualPrice) newErrors.actualPrice = "Please enter the price";
    if (formData.actualPrice < 0) newErrors.actualPrice = "Price must be a positive number";
    if (formData.discountType !== "none" && !formData.discountValue) {
      newErrors.discountValue = "Please enter discount amount";
    }
    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      newErrors.discountValue = "Discount can't be more than 100%";
    }
    if (!formData.thumbnail) newErrors.thumbnail = "Please upload a thumbnail";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: 'Your course has been created',
        confirmButtonColor: '#4f46e5',
        timer: 2000
      }).then(() => {
        navigate("/instructor/courses");
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.response?.data?.message || 'Something went wrong. Please try again',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-black mb-8">Add New Course</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Category Selection */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Category <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={categories}
                value={formData.category}
                onChange={handleInputChange}
                name="category"
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                error={errors.category}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Course Title */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="Enter course description"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Overview */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter course overview"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 resize-none"
              />
              {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview}</p>}
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Actual Price */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Actual Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="actualPrice"
                  value={formData.actualPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                />
                {errors.actualPrice && <p className="text-red-500 text-sm mt-1">{errors.actualPrice}</p>}
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                >
                  <option value="none">No Discount</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Discount Value {formData.discountType !== "none" && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="0.00"
                  disabled={formData.discountType === "none"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
              </div>
            </div>

            {/* Final Price Display */}
            {formData.actualPrice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-700">Final Price:</span>
                  <div className="text-right">
                    {formData.discountType !== "none" && formData.discountValue && (
                      <span className="text-gray-500 line-through mr-2">₹{parseFloat(formData.actualPrice).toFixed(2)}</span>
                    )}
                    <span className="text-2xl font-bold text-blue-600">₹{formData.price || "0.00"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Thumbnail */}
            <ImageUpload
              value={formData.thumbnail}
              onChange={handleThumbnailChange}
              endpoint="/upload/course-thumbnail"
              label="Upload Thumbnail"
              maxSize={5}
              error={errors.thumbnail}
              aspectRatio={16 / 9}
              enableCrop={true}
            />

        
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8">
              <button
                type="button"
                onClick={() => navigate("/instructor/courses")}
                className="px-8 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {createMutation.isPending ? "Creating..." : (formData.published ? "Create & Publish" : "Save as Draft")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}