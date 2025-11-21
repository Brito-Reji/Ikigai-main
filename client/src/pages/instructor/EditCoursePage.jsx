import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, FileImage } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect.jsx";
import { useCourse } from "@/hooks/useRedux.js";
import { useCategory } from "@/hooks/useRedux.js";
import { updateCourse, fetchCourseById, clearUpdateState } from "@/store/slices/courseSlice.js";
import { fetchCategories } from "@/store/slices/categorySlice.js";

export default function EditCoursePage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { 
    currentCourse, 
    updateLoading, 
    updateError, 
    updateSuccess, 
    courseLoading, 
    courseError,
    dispatch: courseDispatch 
  } = useCourse();
  const { categories, loading: categoriesLoading, dispatch: categoryDispatch } = useCategory();
  const [errors, setErrors] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    overview: "",
    price: "",
    thumbnail: "",
    published: false,
  });

  // Fetch course data and categories on component mount
  useEffect(() => {
    if (courseId) {
      courseDispatch(fetchCourseById(courseId));
    }
    if (categories.length === 0) {
      categoryDispatch(fetchCategories());
    }
  }, [courseId, courseDispatch, categoryDispatch, categories.length]);

  // Populate form when course data is loaded
  useEffect(() => {
    if (currentCourse) {
      setFormData({
        category: currentCourse.category?._id || "",
        title: currentCourse.title || "",
        description: currentCourse.description || "",
        overview: currentCourse.overview || "",
        price: currentCourse.price?.toString() || "",
        thumbnail: currentCourse.thumbnail || "",
        published: currentCourse.published || false,
      });
      setThumbnailPreview(currentCourse.thumbnail || null);
    }
  }, [currentCourse]);

  // Handle course update success
  useEffect(() => {
    if (updateSuccess) {
      alert("Course updated successfully!");
      navigate("/instructor/courses");
      courseDispatch(clearUpdateState());
    }
  }, [updateSuccess, navigate, courseDispatch]);

  // Handle course update error
  useEffect(() => {
    if (updateError) {
      alert(updateError);
      courseDispatch(clearUpdateState());
    }
  }, [updateError, courseDispatch]);

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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, thumbnail: "Please select an image file" });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, thumbnail: "Image size should be less than 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setFormData({ ...formData, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, thumbnail: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title.length > 200) newErrors.title = "Title cannot exceed 200 characters";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.description.length > 2000) newErrors.description = "Description cannot exceed 2000 characters";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required";
    if (formData.overview.length > 1000) newErrors.overview = "Overview cannot exceed 1000 characters";
    if (!formData.price) newErrors.price = "Price is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);

    if (!validateForm()) {
      console.log("Validation failed, errors:", errors);
      return;
    }

    console.log("Dispatching updateCourse action...");
    courseDispatch(updateCourse({ courseId, courseData: formData }));
  };

  if (courseLoading) {
    return (
      <div className="bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error loading course: {courseError}</p>
            <button 
              onClick={() => courseDispatch(fetchCourseById(courseId))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-black mb-8">Edit Course</h1>

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

            {/* Price */}
            <div className="w-1/3">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min={0}
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Upload and Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Upload Thumbnail */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Update Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-12">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    {!thumbnailPreview ? (
                      <div className="w-20 h-16 bg-black rounded-md flex items-center justify-center">
                        <FileImage className="w-10 h-8 text-white" />
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="max-h-32 rounded-md"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setThumbnailPreview(null);
                            setFormData({ ...formData, thumbnail: "" });
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </label>
                </div>
                {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
              </div>

              {/* Thumbnail Preview */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Thumbnail Preview
                </label>
                <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-sm">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Course Thumbnail"
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <FileImage className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
                      Learn
                    </span>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {currentCourse?.category?.name || "Category"}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                    <div className="text-sm text-gray-600">
                      {formData.title || "Course title will appear here"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Publish Option */}
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publish course (make it visible to students)
              </label>
            </div>

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
                disabled={updateLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {updateLoading ? "Updating..." : "Update Course"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}