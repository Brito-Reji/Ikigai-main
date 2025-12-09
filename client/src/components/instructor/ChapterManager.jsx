import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Video, Upload } from "lucide-react";
import { useChapter } from "@/hooks/useRedux.js";
import { 
  fetchChapters, 
  createChapter, 
  updateChapter, 
  deleteChapter,
  clearChapterState 
} from "@/store/slices/chapterSlice.js";
import { useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson, useUploadVideo } from "@/hooks/useLessons.js";
import Swal from "sweetalert2";

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
    const result = await Swal.fire({
      title: "Delete Chapter?",
      text: "This will also delete all lessons in this chapter",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      await dispatch(deleteChapter({ courseId, chapterId }));
      Swal.fire("Deleted!", "Chapter has been deleted.", "success");
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief description of what this chapter covers"
                rows="3"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {createLoading ? "Saving..." : editingChapter ? "Update Chapter" : "Add Chapter"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Chapter
            </button>
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <ChapterItem
              key={chapter._id}
              chapter={chapter}
              index={index}
              courseId={courseId}
              isExpanded={expandedChapters[chapter._id]}
              onToggle={() => toggleChapter(chapter._id)}
              onEdit={() => handleEdit(chapter)}
              onDelete={() => handleDelete(chapter._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

function ChapterItem({ chapter, index, courseId, isExpanded, onToggle, onEdit, onDelete }) {
  const { data: lessonsData } = useLessons(courseId, chapter._id);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const lessons = lessonsData?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200">
        <button className="text-gray-400 hover:text-gray-600 mr-3 cursor-move">
          <GripVertical className="w-5 h-5" />
        </button>
        
        <button
          onClick={onToggle}
          className="flex-1 flex items-center text-left"
        >
          <span className="font-semibold text-gray-900 mr-3">
            Chapter {index + 1}:
          </span>
          <span className="text-gray-700">{chapter.title}</span>
          <span className="ml-auto text-gray-500 text-sm">
            {lessons.length} lessons
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 ml-3 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 ml-3 text-gray-400" />
          )}
        </button>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {chapter.description && (
            <p className="text-gray-600 mb-4">{chapter.description}</p>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Lessons</h4>
            <button
              onClick={() => {
                setEditingLesson(null);
                setShowLessonModal(true);
              }}
              className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Lesson
            </button>
          </div>

          {lessons.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No lessons yet</p>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, idx) => (
                <LessonItem
                  key={lesson._id}
                  lesson={lesson}
                  index={idx}
                  onEdit={() => {
                    setEditingLesson(lesson);
                    setShowLessonModal(true);
                  }}
                  courseId={courseId}
                  chapterId={chapter._id}
                />
              ))}
            </div>
          )}

          {showLessonModal && (
            <LessonModal
              courseId={courseId}
              chapterId={chapter._id}
              lesson={editingLesson}
              onClose={() => {
                setShowLessonModal(false);
                setEditingLesson(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function LessonItem({ lesson, index, onEdit, courseId, chapterId }) {
  const deleteLessonMutation = useDeleteLesson();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Lesson?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await deleteLessonMutation.mutateAsync({ courseId, chapterId, lessonId: lesson._id });
        Swal.fire("Deleted!", "Lesson has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", error.response?.data?.message || "Failed to delete", "error");
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center flex-1">
          <Video className="w-4 h-4 mr-3 text-gray-400" />
          <div>
            <p className="font-medium text-sm text-gray-900">
              {index + 1}. {lesson.title}
            </p>
            <p className="text-xs text-gray-500">{lesson.duration} min {lesson.isFree && "• Free"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {lesson.videoUrl && (
            <button 
              onClick={() => setShowVideoModal(true)} 
              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
              title="Preview video"
            >
              <Video className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onEdit} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showVideoModal && (
        <VideoPreviewModal
          lesson={lesson}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </>
  );
}

function LessonModal({ courseId, chapterId, lesson, onClose }) {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    description: lesson?.description || "",
    duration: lesson?.duration || "",
    isFree: lesson?.isFree || false,
  });

  const uploadVideoMutation = useUploadVideo();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      let videoUrl = lesson?.videoUrl;

      if (videoFile) {
        const uploadResult = await uploadVideoMutation.mutateAsync({
          file: videoFile,
          courseId,
          chapterId,
        });
        videoUrl = uploadResult.data.videoPath;
      }

      const lessonData = {
        ...formData,
        videoUrl,
        duration: parseInt(formData.duration) || 0,
      };

      if (lesson) {
        await updateLessonMutation.mutateAsync({
          courseId,
          chapterId,
          lessonId: lesson._id,
          lessonData,
        });
        Swal.fire("Success!", "Lesson updated successfully", "success");
      } else {
        await createLessonMutation.mutateAsync({
          courseId,
          chapterId,
          lessonData,
        });
        Swal.fire("Success!", "Lesson created successfully", "success");
      }

      onClose();
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.message || "Failed to save lesson", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{lesson ? "Edit Lesson" : "Add Lesson"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Video {!lesson && "*"}</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {lesson?.videoUrl && !videoFile && (
                <p className="text-xs text-gray-500 mt-1">Current video will be kept if no new file is selected</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFree}
                onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm">Free preview</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              {uploading ? "Uploading..." : lesson ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VideoPreviewModal({ lesson, onClose }) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lesson.videoUrl) {
      const courseId = window.location.pathname.split('/')[3];
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      const streamUrl = `http://localhost:3000/api/instructor/stream-video?courseId=${courseId}&videoPath=${encodeURIComponent(lesson.videoUrl)}&token=${token}`;
      setVideoUrl(streamUrl);
      setLoading(false);
    }
  }, [lesson.videoUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{lesson.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="p-4">
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600">Loading video...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}
          
          {videoUrl && !loading && (
            <div>
              <video
                controls
                className="w-full rounded-lg bg-black"
                style={{ maxHeight: '70vh' }}
                onError={(e) => {
                  console.error('Video playback error:', e);
                  setError('Failed to load video. The file may not exist or is not accessible.');
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-xs text-gray-500 mt-2">Video path: {lesson.videoUrl}</p>
            </div>
          )}
        </div>
        
        {lesson.description && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">{lesson.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterManager;
