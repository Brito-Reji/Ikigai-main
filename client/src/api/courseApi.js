import api from './axiosConfig'

export const courseApi = {
    // Instructor courses
    getCourses: async () => {
        const { data } = await api.get('/instructor/courses')
        return data
    },

    getCourseById: async (courseId) => {
        const { data } = await api.get(`/instructor/courses/${courseId}`)
        return data
    },

    createCourse: async (courseData) => {
        const { data } = await api.post('/instructor/courses', courseData)
        return data
    },

    updateCourse: async ({ courseId, courseData }) => {
        const { data } = await api.put(`/instructor/courses/${courseId}`, courseData)
        return data
    },

    applyForVerification: async (courseId) => {
        const { data } = await api.post(`/instructor/courses/${courseId}/apply-verification`)
        return data
    },

    // Public courses
    getPublishedCourses: async (params) => {
        const { data } = await api.get('/public/courses', { params })
        return data
    },

    getFeaturedCourses: async (params) => {
        const { data } = await api.get('/public/courses/featured', { params })
        return data
    },

    getPublicCourseDetails: async (courseId) => {
        const { data } = await api.get(`/public/courses/${courseId}`)
        return data
    },
}
