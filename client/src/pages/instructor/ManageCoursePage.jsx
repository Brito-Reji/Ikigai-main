import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Video, ChevronDown, ChevronUp } from "lucide-react";
import { useInstructorChapters, useCreateChapter, useUpdateChapter, useDeleteChapter } from "@/hooks/useChapters";
import { useInstructorLessons, useCreateLesson, useUpdateLesson, useDeleteLesson, useUploadVideo } from "@/hooks/useLessons";
import Swal from "sweetalert2";

export default function ManageCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  const { data: chaptersData, isLoading } = useInstructorChapters(courseId);
  const createChapterMutation = useCreateChapter();
  const updateChapterMutation = useUpdateChapter();
  const deleteChapterMutation = useDeleteChapter();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const uploadVideoMutation = useUploadVideo();

  const chapters = chaptersData?.data || [];

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await createChapterMutation.mutateAsync({
        courseId,
        chapterData: {
          title: formData.get("title"),
          description: formData.get("description"),
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Chapter created successfully",
        confirmButtonColor: "#14b8a6",
      });
      setShowChapterModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to create chapter",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleDeleteChapter = async (chapterId) => {
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
      try {
        await deleteChapterMutation.mutateAsync({ courseId, chapterId });
        Swal.fire("Deleted!", "Chapter has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", error.response?.data?.message || "Failed to delete", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Manage Course Content</h1>
            <button
              onClick={() => {
                setEditingChapter(null);
                setShowChapterModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Chapter
            </button>
          </div>
        </div>

        {chapters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">No chapters yet. Create your first chapter to get started.</p>
            <button
              onClick={() => setShowChapterModal(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Chapter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <ChapterItem
                key={chapter._id}
                chapter={chapter}
                courseId={courseId}
                isExpanded={expandedChapter === chapter._id}
                onToggle={() => setExpandedChapter(expandedChapter === chapter._id ? null : chapter._id)}
                onEdit={() => {
                  setEditingChapter(chapter);
                  setShowChapterModal(true);
                }}
                onDelete={() => handleDeleteChapter(chapter._id)}
                onAddLesson={() => {
                  setSelectedChapterId(chapter._id);
                  setEditingLesson(null);
                  setShowLessonModal(true);
                }}
              />
            ))}
          </div>
        )}

        {showChapterModal && (
          <ChapterModal
            chapter={editingChapter}
            onClose={() => setShowChapterModal(false)}
            onSubmit={handleCreateChapter}
          />
        )}

        {showLessonModal && (
          <LessonModal
            courseId={courseId}
            chapterId={selectedChapterId}
            lesson={editingLesson}
            onClose={() => setShowLessonModal(false)}
            uploadVideoMutation={uploadVideoMutation}
            createLessonMutation={createLessonMutation}
          />
        )}
      </div>
    </div>
  );
}

function ChapterItem({ chapter, courseId, isExpanded, onToggle, onEdit, onDelete, onAddLesson }) {
  const { data: lessonsData } = useInstructorLessons(courseId, chapter._id);
  const lessons = lessonsData?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button onClick={onToggle} className="mr-3">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <div>
            <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
            <p className="text-sm text-gray-600">{lessons.length} lessons</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onAddLesson} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="p-2 text-gray-600 hover:bg-gray-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t px-4 py-3 bg-gray-50">
          {lessons.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-4">No lessons yet</p>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <div key={lesson._id} className="flex items-center justify-between bg-white p-3 rounded">
                  <div className="flex items-center">
                    <Video className="w-4 h-4 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <p className="text-xs text-gray-500">{lesson.duration} min</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChapterModal({ chapter, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{chapter ? "Edit Chapter" : "Create Chapter"}</h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={chapter?.title}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                defaultValue={chapter?.description}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">
              {chapter ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LessonModal({ courseId, chapterId, lesson, onClose, uploadVideoMutation, createLessonMutation }) {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setUploading(true);
      let videoUrl = formData.get("videoUrl");

      if (videoFile) {
        const uploadResult = await uploadVideoMutation.mutateAsync({
          file: videoFile,
          courseId,
          chapterId,
        });
        videoUrl = uploadResult.data.videoPath;
      }

      await createLessonMutation.mutateAsync({
        courseId,
        chapterId,
        lessonData: {
          title: formData.get("title"),
          description: formData.get("description"),
          videoUrl,
          duration: parseInt(formData.get("duration")) || 0,
          isFree: formData.get("isFree") === "on",
        },
      });

      Swal.fire("Success!", "Lesson created successfully", "success");
      onClose();
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.message || "Failed to create lesson", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Lesson</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input type="text" name="title" required className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea name="description" rows="3" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input type="number" name="duration" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="isFree" className="mr-2" />
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
              {uploading ? "Uploading..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
