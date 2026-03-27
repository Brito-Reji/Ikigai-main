import api from './axiosConfig'
import instructorApi from './instructorAxiosConfig'
import { chapterEndpoints } from './endpoints/chapterEndpoints'

export const chapterApi = {
    instructor: {
        getChapters: async (courseId) => {
            const { data } = await instructorApi.get(chapterEndpoints.instructor.list(courseId))
            return data
        },

        createChapter: async ({ courseId, chapterData }) => {
            const { data } = await instructorApi.post(chapterEndpoints.instructor.create(courseId), chapterData)
            return data
        },

        updateChapter: async ({ courseId, chapterId, chapterData }) => {
            const { data } = await instructorApi.put(chapterEndpoints.instructor.update(courseId, chapterId), chapterData)
            return data
        },

        deleteChapter: async ({ courseId, chapterId }) => {
            const { data } = await instructorApi.delete(chapterEndpoints.instructor.delete(courseId, chapterId))
            return data
        },
    },

    student: {
        getChapters: async (courseId) => {
            const { data } = await api.get(chapterEndpoints.student.list(courseId))
            return data
        },

        getChapterById: async (courseId, chapterId) => {
            const { data } = await api.get(chapterEndpoints.student.byId(courseId, chapterId))
            return data
        },
    },
}
