import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useChapter } from "@/hooks/useRedux.js";
import { 
  fetchChapters, 
  createChapter, 
  updateChapter, 
  deleteChapter,
  clearChapterState 
} from "@/store/slices/chapterSlice.js";

const ChapterManager = ({ courseId }) => {
  const { chapters, loading, createLoading, dispatch } = useChapter();
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    if (courseId) {
      dispatch(fetchChapters(courseId));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearChapterState());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingChapter) {
      await dispatch(updateChapter({
        courseId,
        chapterId: editingChapter._id,
        chapterData: formData
      }));
      setEditingChapter(null);
    } else {
      await dispatch(createChapter({
        courseId,
        chapterData: formData
      }));
      setShowAddChapter(false);
    }
    
    setFormData({ title: "", description: "" });
  };

  const handleEdit = (chapter) => {
    setEditingChapter(chapter);
    setFormData({
      title: chapter.title,
      description: chapter.description || ""
    });
    setShowAddChapter(true);
  };

  const handleDelete = async (chapterId) => {
    if (window.confirm("Are you sure you want to delete this chapter?")) {
      await dispatch(deleteChapter({ courseId, chapterId }));
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleCancel = () => {
    setShowAddChapter(false);
    setEditingChapter(null);
    setFormData({ title: "", description: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
        <button
          onClick={() => setShowAddChapter(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Chapter
        </button>
      </div>

      {/* Add/Edit Chapter Form */}
      {showAddChapter && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingChapter ? "Edit Chapter" : "Add New Chapter"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Introduction to React"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Brief description of what this chapter covers"
                rows="3"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {createLoading ? "Saving..." : editingChapter ? "Update Chapter" : "Add Chapter"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-4">
        {chapters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Chapters Yet</h3>
            <p className="text-gray-600 mb-6">Start building your course curriculum by adding chapters</p>
            <button
              onClick={() => setShowAddChapter(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Chapter
            </button>
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <div key={chapter._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Chapter Header */}
              <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200">
                <button className="text-gray-400 hover:text-gray-600 mr-3 cursor-move">
                  <GripVertical className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => toggleChapter(chapter._id)}
                  className="flex-1 flex items-center text-left"
                >
                  <span className="font-semibold text-gray-900 mr-3">
                    Chapter {index + 1}:
                  </span>
                  <span className="text-gray-700">{chapter.title}</span>
                  <span className="ml-auto text-gray-500 text-sm">
                    {chapter.lessons?.length || 0} lessons
                  </span>
                  {expandedChapters[chapter._id] ? (
                    <ChevronUp className="w-5 h-5 ml-3 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 ml-3 text-gray-400" />
                  )}
                </button>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(chapter)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(chapter._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chapter Content (Expanded) */}
              {expandedChapters[chapter._id] && (
                <div className="p-6">
                  {chapter.description && (
                    <p className="text-gray-600 mb-4">{chapter.description}</p>
                  )}
                  
                  {/* Lessons will be displayed here */}
                  <div className="text-gray-500 text-sm italic">
                    Lesson management coming soon...
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChapterManager;
