import api from "./adminAxiosConfig.js";

export const adminApiService = {
  getDashboard: () => api.get("/admin/dashboard"),
  getOrders: params => api.get("/admin/orders", { params }),
  getInstructors: () => api.get("/admin/instructors"),
  getInstructorById: id => api.get(`/admin/instructors/${id}`),
  toggleInstructorBlock: id => api.patch(`/admin/instructors/${id}/toggle-block`),
  getStudents: () => api.get("/admin/students"),
  getStudentById: id => api.get(`/admin/students/${id}`),
  toggleStudentBlock: id => api.patch(`/admin/students/${id}/toggle-block`),
  getCategories: params => api.get("/categories", { params }),
  createCategory: data => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  toggleCategoryBlock: id => api.patch(`/categories/${id}/toggle-block`),
};
