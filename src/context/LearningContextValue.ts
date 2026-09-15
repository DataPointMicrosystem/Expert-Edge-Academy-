import { createContext } from "react";
import type { Certificate, Enrollment, Notification } from "../lib/learningApi";

export interface LearningContextValue {
  enrollments: Enrollment[];
  certificates: Certificate[];
  notifications: Notification[];
  wishlistIds: string[];
  loading: boolean;
  refresh: () => Promise<void>;
  enrollFree: (courseId: string) => Promise<void>;
  updateProgress: (enrollmentId: string, lessonId: string, isCompleted: boolean, watchedDuration?: number) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  enrollmentFor: (courseId: string) => Enrollment | undefined;
  toggleWishlist: (courseId: string) => Promise<void>;
  isWishlisted: (courseId: string) => boolean;
  markNotification: (notificationId: string) => Promise<void>;
  markAllNotifications: () => Promise<void>;
}

export const LearningContext = createContext<LearningContextValue | null>(null);