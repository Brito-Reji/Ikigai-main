import api from './axiosConfig'
import { courseEndpoints } from './endpoints/courseEndpoints'

export const courseApi = {
  instructor: {
    getCourses: async () => {
      const { data } = await api.get(courseEndpoints.instructor.list());
      return data;
    },

    getCourseById: async courseId => {
      const { data } = await api.get(courseEndpoints.instructor.byId(courseId));
      return data;
    },

    createCourse: async courseData => {
      const { data } = await api.post(
        courseEndpoints.instructor.create(),
        courseData
      );
      return data;
    },

    updateCourse: async ({ courseId, courseData }) => {
      const { data } = await api.put(
        courseEndpoints.instructor.update(courseId),
        courseData
      );
      return data;
    },

    applyForVerification: async courseId => {
      const { data } = await api.post(
        courseEndpoints.instructor.applyVerification(courseId)
      );
      return data;
    },

    togglePublish: async courseId => {
      const { data } = await api.patch(
        courseEndpoints.instructor.togglePublish(courseId)
      );
      return data;
    },
  },

  student: {
    getCourses: async params => {
      const { data } = await api.get(courseEndpoints.student.list(), {
        params,
      });
      return data;
    },

    getCourseById: async courseId => {
      const { data } = await api.get(courseEndpoints.student.byId(courseId));
      return data;
    },
    verifyPayment: async (payload) => {
     const res = await api.post(courseApi.student.verifyPayment(), payload);
     return res.data;
    },
  },

  public: {
    getCourses: async params => {
      const { data } = await api.get(courseEndpoints.public.list(), { params });
      return data;
    },

    getFeaturedCourses: async params => {
      const { data } = await api.get(courseEndpoints.public.featured(), {
        params,
      });
      return data;
    },

    getCourseDetails: async courseId => {
      const { data } = await api.get(courseEndpoints.public.details(courseId));
      return data;
    },

    getChapters: async courseId => {
      const { data } = await api.get(courseEndpoints.public.chapters(courseId));

      return data;
    },

    getLessons: async (courseId, chapterId) => {
      const { data } = await api.get(
        courseEndpoints.public.lessons(courseId, chapterId)
      );
      return data;
    },
  },

  admin: {
    getCourses: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const { data } = await api.get(
        `${courseEndpoints.admin.list()}?${params.toString()}`
      );
      return data;
    },

    getCourseById: async courseId => {
      const { data } = await api.get(courseEndpoints.admin.byId(courseId));
      return data;
    },

    getStatistics: async () => {
      const { data } = await api.get(courseEndpoints.admin.statistics());
      return data;
    },

    getChapters: async courseId => {
      const { data } = await api.get(courseEndpoints.admin.chapters(courseId));
      return data;
    },

    toggleBlock: async courseId => {
      const { data } = await api.patch(
        courseEndpoints.admin.toggleBlock(courseId)
      );
      return data;
    },

    deleteCourse: async courseId => {
      const { data } = await api.delete(courseEndpoints.admin.delete(courseId));
      return data;
    },

    updateVerification: async ({ courseId, status, rejectionReason }) => {
      const { data } = await api.patch(
        courseEndpoints.admin.updateVerification(courseId),
        {
          status,
          rejectionReason,
        }
      );
      return data;
    },

    getPendingVerifications: async (page = 1, limit = 20) => {
      const { data } = await api.get(
        `${courseEndpoints.admin.pendingVerifications()}?page=${page}&limit=${limit}`
      );
      return data;
    },

    getVerificationStatistics: async () => {
      const { data } = await api.get(
        courseEndpoints.admin.verificationStatistics()
      );
      return data;
    },
  },
};

