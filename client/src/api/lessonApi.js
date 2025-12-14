import api from './axiosConfig'
import { lessonEndpoints } from './endpoints/lessonEndpoints'

export const lessonApi = {
    instructor: {
        getLessons: async (courseId, chapterId) => {
            const { data } = await api.get(lessonEndpoints.instructor.list(courseId, chapterId))
            return data
        },

        createLesson: async ({ courseId, chapterId, lessonData }) => {
            const { data } = await api.post(lessonEndpoints.instructor.create(courseId, chapterId), lessonData)
            return data
        },

        updateLesson: async ({ courseId, chapterId, lessonId, lessonData }) => {
            const { data } = await api.put(lessonEndpoints.instructor.update(courseId, chapterId, lessonId), lessonData)
            return data
        },

        deleteLesson: async ({ courseId, chapterId, lessonId }) => {
            const { data } = await api.delete(lessonEndpoints.instructor.delete(courseId, chapterId, lessonId))
            return data
        },

        uploadVideo: async ({ file, courseId, chapterId }) => {
            const formData = new FormData()
            formData.append('video', file)
            formData.append('courseId', courseId)
            formData.append('chapterId', chapterId)

            const { data } = await api.post(lessonEndpoints.instructor.uploadVideo(), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return data
        },
    },

    student: {
        getLessons: async (courseId, chapterId) => {
            const { data } = await api.get(lessonEndpoints.student.list(courseId, chapterId))
            return data
        },

        getLessonById: async (courseId, chapterId, lessonId) => {
            const { data } = await api.get(lessonEndpoints.student.byId(courseId, chapterId, lessonId))
            return data
        },
    },
}
