import { apiRequest } from "./api";

export type Enrollment = Record<string, any>;
export type Notification = Record<string, any>;
export type Certificate = Record<string, any>;
export type Review = Record<string, any>;

export const learningApi = {
  getEnrollments: () =>
    apiRequest<{ data: Enrollment[] }>("/enrollments/my-courses"),
  enrollFree: (courseId: string) =>
    apiRequest(`/enrollments/${courseId}`, { method: "POST" }),
  getEnrollment: (enrollmentId: string) =>
    apiRequest<{ data: Enrollment }>(`/enrollments/${enrollmentId}`),
  updateProgress: (
    enrollmentId: string,
    body: { lessonId: string; isCompleted: boolean; watchedDuration: number },
  ) =>
    apiRequest(`/enrollments/${enrollmentId}/progress`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getAccess: (courseId: string) =>
    apiRequest<{ data: { hasAccess: boolean } }>(
      `/enrollments/access/${courseId}`,
    ),
  getWishlist: () => apiRequest<{ data: any[] }>("/wishlist"),
  addWishlist: (courseId: string) =>
    apiRequest(`/wishlist/add/${courseId}`, { method: "POST" }),
  removeWishlist: (courseId: string) =>
    apiRequest(`/wishlist/remove/${courseId}`, { method: "DELETE" }),
  getReviews: (courseId: string) =>
    apiRequest<{ data: Review[] }>(`/reviews/courses/${courseId}`),
  submitReview: (
    courseId: string,
    body: { title: string; content: string; rating: number },
  ) =>
    apiRequest(`/reviews/courses/${courseId}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateReview: (
    reviewId: string,
    body: Partial<{ title: string; content: string; rating: number }>,
  ) =>
    apiRequest(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteReview: (reviewId: string) =>
    apiRequest(`/reviews/${reviewId}`, { method: "DELETE" }),
  getCertificates: () => apiRequest<{ data: Certificate[] }>("/certificates"),
  getPaymentHistory: () => apiRequest<{ data: any[] }>("/payments/history"),
  getCertificate: (certificateId: string) =>
    apiRequest<{ data: Certificate }>(`/certificates/${certificateId}`),
  getNotifications: (unread = false) =>
    apiRequest<{ data: Notification[] }>(
      `/notifications${unread ? "?unread=true" : ""}`,
    ),
  markNotification: (notificationId: string) =>
    apiRequest(`/notifications/${notificationId}`, { method: "PUT" }),
  markAllNotifications: () =>
    apiRequest("/notifications/read-all", { method: "PUT" }),
  getInstructorCourses: () =>
    apiRequest<{ data: any[] }>("/courses/instructor/me"),
  createCourse: (body: unknown) =>
    apiRequest("/courses", { method: "POST", body: JSON.stringify(body) }),
  updateCourse: (courseId: string, body: unknown) =>
    apiRequest(`/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteCourse: (courseId: string) =>
    apiRequest(`/courses/${courseId}`, { method: "DELETE" }),
  submitCourse: (courseId: string) =>
    apiRequest(`/courses/${courseId}/submit`, { method: "POST" }),
  getAdminAnalytics: () => apiRequest<{ data: any }>("/admin/analytics"),
  getAdminUsers: () => apiRequest<{ data: any[] }>("/admin/users"),
  getAdminCourses: () => apiRequest<{ data: any[] }>("/admin/courses"),
  reviewCourse: (
    courseId: string,
    body: { approved: boolean; rejectionReason?: string },
  ) =>
    apiRequest(`/admin/courses/${courseId}/review`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  publishCourse: (courseId: string, published: boolean) =>
    apiRequest(`/admin/courses/${courseId}/publication`, {
      method: "PATCH",
      body: JSON.stringify({ published }),
    }),
};
