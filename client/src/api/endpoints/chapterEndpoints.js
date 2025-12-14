export const chapterEndpoints = {
    instructor: {
        list: (courseId) => `/instructor/courses/${courseId}/chapters`,
        create: (courseId) => `/instructor/courses/${courseId}/chapters`,
        update: (courseId, chapterId) => `/instructor/courses/${courseId}/chapters/${chapterId}`,
        delete: (courseId, chapterId) => `/instructor/courses/${courseId}/chapters/${chapterId}`,
    },
    student: {
        list: (courseId) => `/courses/${courseId}/chapters`,
        byId: (courseId, chapterId) => `/courses/${courseId}/chapters/${chapterId}`,
    },
    admin: {
        list: (courseId) => `/admin/courses/${courseId}/chapters`,
        byId: (courseId, chapterId) => `/admin/courses/${courseId}/chapters/${chapterId}`,
    },
}

    