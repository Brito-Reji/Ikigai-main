export const courseEndpoints = {
  instructor: {
    list: () => '/instructor/courses',
    byId: courseId => `/instructor/courses/${courseId}`,
    create: () => '/instructor/courses',
    update: courseId => `/instructor/courses/${courseId}`,
    applyVerification: courseId =>
      `/instructor/courses/${courseId}/apply-verification`,
    togglePublish: courseId => `/instructor/courses/${courseId}/toggle-publish`,
  },

  public: {
    list: () => '/public/courses',
    featured: () => '/public/courses/featured',
    details: courseId => `/public/courses/${courseId}`,
    chapters: courseId => `/public/courses/${courseId}/chapters`,
    lessons: (courseId, chapterId) =>
      `/public/courses/${courseId}/chapters/${chapterId}`,
  },

  student: {
  
    verifyPayment: () => '/payments/verify-payment',
    enrolledCourses: () => '/student/enrolled-courses',
  },

  admin: {
    list: () => '/admin/courses',
    byId: courseId => `/admin/courses/${courseId}`,
    statistics: () => '/admin/courses/statistics',
    chapters: courseId => `/admin/courses/${courseId}/chapters`,
    toggleBlock: courseId => `/admin/courses/${courseId}/toggle-block`,
    delete: courseId => `/admin/courses/${courseId}`,
    updateVerification: courseId => `/admin/courses/${courseId}/verification`,
    pendingVerifications: () => '/admin/verifications/pending',
    verificationStatistics: () => '/admin/verifications/statistics',
  },
};

