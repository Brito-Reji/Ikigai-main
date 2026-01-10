import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useInstructorCourse, useUpdateCourse } from "@/hooks/useCourses.js";
import { useCategories } from "@/hooks/useCategories.js";
import ChapterManager from "@/components/instructor/ChapterManager.jsx";
import SearchableSelect from "@/components/ui/SearchableSelect.jsx";
import ImageUpload from "@/components/ui/ImageUpload.jsx";
import Swal from "sweetalert2";

const EditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: courseData, isLoading: courseLoading } = useInstructorCourse(courseId);
  const { data: categoriesData } = useCategories();
  const updateMutation = useUpdateCourse();

  const currentCourse = courseData?.data;
  const categories = categoriesData?.categories || [];

  const [activeTab, setActiveTab] = useState("details");
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
  const [errors, setErrors] = useState({});

  // Populate form when course loads
  useEffect(() => {
    if (currentCourse) {
      setFormData({
        category: currentCourse.category?._id || "",
        title: currentCourse.title || "",
        description: currentCourse.description || "",
        overview: currentCourse.overview || "",
        actualPrice: currentCourse.actualPrice || "",
        discountType: currentCourse.discountType || "none",
        discountValue: currentCourse.discountValue || "",
        price: currentCourse.price || "",
        thumbnail: currentCourse.thumbnail || "",
        published: currentCourse.published || false,
      });
    }
  }, [currentCourse]);



  // Calculate final price
  useEffect(() => {
    if (formData.actualPrice && formData.discountType !== "none" && formData.discountValue) {
      let finalPrice = parseFloat(formData.actualPrice);

      if (formData.discountType === "percentage") {
        const discount = (finalPrice * parseFloat(formData.discountValue)) / 100;
        finalPrice = finalPrice - discount;
      } else if (formData.discountType === "fixed") {
        finalPrice = finalPrice - parseFloat(formData.discountValue);
      }

      setFormData(prev => ({ ...prev, price: Math.max(0, finalPrice).toFixed(2) }));
    } else if (formData.actualPrice) {
      setFormData(prev => ({ ...prev, price: parseFloat(formData.actualPrice).toFixed(2) }));
    }
  }, [formData.actualPrice, formData.discountType, formData.discountValue]);

  const handleSave = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors before saving",
        confirmButtonColor: "#ef4444"
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({ courseId, courseData: formData });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Course updated successfully",
        confirmButtonColor: "#14b8a6",
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to update course",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.title || !formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title && formData.title.length > 200) newErrors.title = "Title cannot exceed 200 characters";
    if (!formData.description || !formData.description.trim()) newErrors.description = "Description is required";
    if (formData.description && formData.description.length > 2000) newErrors.description = "Description cannot exceed 2000 characters";
    if (!formData.overview || !formData.overview.trim()) newErrors.overview = "Overview is required";
    if (formData.overview && formData.overview.length > 1000) newErrors.overview = "Overview cannot exceed 1000 characters";
    if (!formData.actualPrice || formData.actualPrice === "") newErrors.actualPrice = "Actual price is required";
    if (formData.actualPrice && parseFloat(formData.actualPrice) < 0) newErrors.actualPrice = "Actual price cannot be negative";
    if (formData.discountType !== "none" && (!formData.discountValue || formData.discountValue === "")) {
      newErrors.discountValue = "Discount value is required";
    }
    if (formData.discountType === "percentage" && formData.discountValue && parseFloat(formData.discountValue) > 100) {
      newErrors.discountValue = "Percentage cannot exceed 100%";
    }
    if (!formData.thumbnail) newErrors.thumbnail = "Thumbnail is required";

    setErrors(newErrors);

    // Log errors for debugging
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  if (courseLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <button
            onClick={() => navigate("/instructor/courses")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "details", label: "Course Details" },
    { id: "curriculum", label: "Curriculum" },
    { id: "pricing", label: "Pricing" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/instructor/courses")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentCourse.title}</h1>
              <p className="text-gray-600 mt-2">Edit your course content and settings</p>
            </div>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "details" && (
              <CourseDetailsTab
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                categories={categories}
              />
            )}

            {activeTab === "curriculum" && (
              <ChapterManager courseId={courseId} />
            )}

            {activeTab === "pricing" && (
              <PricingTab
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Course Details Tab Component
const CourseDetailsTab = ({ formData, setFormData, errors, setErrors, categories }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleThumbnailChange = (url) => {
    setFormData(prev => ({ ...prev, thumbnail: url }));
    if (errors.thumbnail) {
      setErrors(prev => ({ ...prev, thumbnail: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Details</h2>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
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

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Overview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overview <span className="text-red-500">*</span>
        </label>
        <textarea
          name="overview"
          value={formData.overview}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview}</p>}
      </div>

      {/* Thumbnail */}
      <ImageUpload
        value={formData.thumbnail}
        onChange={handleThumbnailChange}
        endpoint="/upload/course-thumbnail"
        label="Course Thumbnail"
        maxSize={5}
        error={errors.thumbnail}
        aspectRatio={16 / 9}
        enableCrop={true}
      />
    </div>
  );
};

// Pricing Tab Component
const PricingTab = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Actual Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actual Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="actualPrice"
            value={formData.actualPrice}
            onChange={handleInputChange}
            min={0}
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.actualPrice && <p className="text-red-500 text-sm mt-1">{errors.actualPrice}</p>}
        </div>

        {/* Discount Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Type
          </label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="none">No Discount</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Value {formData.discountType !== "none" && <span className="text-red-500">*</span>}
          </label>
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleInputChange}
            min={0}
            step="0.01"
            disabled={formData.discountType === "none"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
        </div>
      </div>

      {/* Final Price Display */}
      {formData.actualPrice && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">Final Price:</span>
            <div className="text-right">
              {formData.discountType !== "none" && formData.discountValue && (
                <span className="text-gray-500 line-through mr-2">₹{parseFloat(formData.actualPrice).toFixed(2)}</span>
              )}
              <span className="text-2xl font-bold text-indigo-600">₹{formData.price || "0.00"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ formData, setFormData }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Settings</h2>
      <div className="space-y-4">
        {/* Published Status */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            Publish course (make it visible to students)
          </label>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Unpublishing a course will hide it from students but won't affect existing enrollments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
