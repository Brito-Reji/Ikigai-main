import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, ChevronRight, Home, FileImage } from "lucide-react";
import api from "@/api/axiosConfig.js";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
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

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories");
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to mock data if API fails
      setCategories([
        { _id: "1", name: "Web Development" },
        { _id: "2", name: "Data Science" },
        { _id: "3", name: "Mobile Development" },
      ]);
    }
  };

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
    if (!formData.thumbnail) newErrors.thumbnail = "Thumbnail is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/instructor/courses", formData);
      
      if (response.data.success) {
        alert("Course created successfully!");
        navigate("/instructor/courses");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert(error.response?.data?.message || "Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-6 text-gray-600">
          <button
            onClick={() => navigate("/instructor/dashboard")}
            className="hover:text-gray-900"
          >
            <Home className="w-4 h-4" />
          </button>
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => navigate("/instructor/courses")}
            className="hover:text-gray-900"
          >
            Courses
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Add New Course</span>
        </nav>

        {/* Header */}
        <h1 className="text-2xl font-bold text-black mb-8">Add New Course</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Course Title */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Overview */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Overview
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 resize-none"
              />
              {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview}</p>}
            </div>

            {/* Price */}
            <div className="w-1/3">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min={0}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Upload and Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Upload Thumbnail */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Upload Thumbnail
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
                      Figma
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
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? "Creating..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}