export const lessonEndpoints = {
    instructor: {
        list: (courseId, chapterId) => `/instructor/courses/${courseId}/chapters/${chapterId}/lessons`,
        create: (courseId, chapterId) => `/instructor/courses/${courseId}/chapters/${chapterId}/lessons`,
        update: (courseId, chapterId, lessonId) => `/instructor/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
        delete: (courseId, chapterId, lessonId) => `/instructor/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
        uploadVideo: () => '/instructor/upload-video',
    },
    student: {
        list: (courseId, chapterId) => `/courses/${courseId}/chapters/${chapterId}/lessons`,
        byId: (courseId, chapterId, lessonId) => `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
    },
    admin: {
        list: (courseId, chapterId) => `/admin/courses/${courseId}/chapters/${chapterId}/lessons`,
        byId: (courseId, chapterId, lessonId) => `/admin/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
    },
}

