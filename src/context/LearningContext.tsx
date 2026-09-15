import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { LearningContext } from "./LearningContextValue";
import {
  learningApi,
  type Certificate,
  type Enrollment,
  type Notification,
} from "../lib/learningApi";

const courseIdOf = (value: any) =>
  value?.course?._id ||
  value?.course?.id ||
  value?.course?.slug ||
  value?.courseId ||
  value?._id ||
  value?.id;

export function LearningProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) {
      setEnrollments([]);
      setCertificates([]);
      setNotifications([]);
      setWishlistIds([]);
      return;
    }
    setLoading(true);
    try {
      const [
        enrollmentResult,
        certificateResult,
        notificationResult,
        wishlistResult,
      ] = await Promise.all([
        learningApi.getEnrollments(),
        learningApi.getCertificates(),
        learningApi.getNotifications(),
        learningApi.getWishlist(),
      ]);
      setEnrollments(enrollmentResult.data || []);
      setCertificates(certificateResult.data || []);
      setNotifications(notificationResult.data || []);
      setWishlistIds(
        (wishlistResult.data || []).map(courseIdOf).filter(Boolean),
      );
    } catch {
      setEnrollments([]);
      setCertificates([]);
      setNotifications([]);
      setWishlistIds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user?.id]);

  const enrollFree = async (courseId: string) => {
    await learningApi.enrollFree(courseId);
    await refresh();
  };

  const updateProgress = async (
    enrollmentId: string,
    lessonId: string,
    isCompleted: boolean,
    watchedDuration = 0,
  ) => {
    await learningApi.updateProgress(enrollmentId, {
      lessonId,
      isCompleted,
      watchedDuration,
    });
    setEnrollments((current) =>
      current.map((item) =>
        item._id === enrollmentId || item.id === enrollmentId
          ? { ...item, progress: item.progress }
          : item,
      ),
    );
  };

  const enrollmentFor = (courseId: string) =>
    enrollments.find((item) => courseIdOf(item) === courseId);
  const isEnrolled = (courseId: string) => Boolean(enrollmentFor(courseId));

  const toggleWishlist = async (courseId: string) => {
    if (wishlistIds.includes(courseId)) {
      await learningApi.removeWishlist(courseId);
      setWishlistIds((current) => current.filter((id) => id !== courseId));
    } else {
      await learningApi.addWishlist(courseId);
      setWishlistIds((current) => [...current, courseId]);
    }
  };

  const markNotification = async (notificationId: string) => {
    await learningApi.markNotification(notificationId);
    setNotifications((current) =>
      current.map((item) =>
        item._id === notificationId || item.id === notificationId
          ? { ...item, isRead: true, read: true }
          : item,
      ),
    );
  };

  const markAllNotifications = async () => {
    await learningApi.markAllNotifications();
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true, read: true })),
    );
  };

  return (
    <LearningContext.Provider
      value={{
        enrollments,
        certificates,
        notifications,
        wishlistIds,
        loading,
        refresh,
        enrollFree,
        updateProgress,
        isEnrolled,
        enrollmentFor,
        toggleWishlist,
        isWishlisted: (id) => wishlistIds.includes(id),
        markNotification,
        markAllNotifications,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}
