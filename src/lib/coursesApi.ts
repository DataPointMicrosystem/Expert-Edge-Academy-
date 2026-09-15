import { apiRequest } from "./api";
import type { Course } from "../data/courses";

type RemoteCourse = Record<string, any>;

export function toCourse(course: RemoteCourse): Course {
  const instructor =
    typeof course.instructor === "string"
      ? course.instructor
      : course.instructor?.fullName || "ExpertEdge instructor";
  const sections = (Array.isArray(course.sections) ? course.sections : []).map(
    (section: any) => ({
      ...section,
      lectures:
        section.lectures ||
        (section.lessons || []).map((lesson: any) => ({
          ...lesson,
          id: lesson._id || lesson.id,
          duration: lesson.duration || lesson.videoDuration || "0:00",
          free: Boolean(lesson.isPreview || lesson.free),
          completed: false,
        })),
    }),
  );
  const lectures = sections.reduce(
    (total: number, section: any) =>
      total + (section.lessons?.length || section.lectures?.length || 0),
    0,
  );

  return {
    id: course.slug || course._id || course.id,
    title: course.title || "Untitled course",
    instructor,
    instructorAvatar:
      course.instructor?.avatar || "photo-1500648767791-00dcc994a43e",
    rating: Number(course.rating || course.averageRating || 0),
    reviews: Number(course.reviewsCount || course.reviewCount || 0),
    price: Number(course.price || 0),
    originalPrice: Number(course.originalPrice || course.price || 0),
    image:
      course.thumbnail?.url ||
      course.thumbnail ||
      "photo-1498050108023-c5249f4df085",
    level: course.level || "All Levels",
    hours: Number(course.duration || course.hours || 0),
    lectures: Number(course.lectures || lectures),
    category:
      typeof course.category === "string"
        ? course.category
        : course.category?.name || "General",
    badge: course.badge,
    description: course.shortDescription || course.description || "",
    tags: course.tags || [],
    enrolled: Number(course.enrolledCount || course.enrolled || 0),
    language: course.language || "English",
    lastUpdated: course.updatedAt
      ? new Date(course.updatedAt).toLocaleDateString()
      : "Recently updated",
    whatYoullLearn: course.learningOutcomes || [],
    requirements: course.requirements || [],
    sections,
  } as Course;
}

export async function getCourses(query = "") {
  const response = await apiRequest<{ data: RemoteCourse[] }>(
    `/courses${query}`,
  );
  return (response.data || []).map(toCourse);
}

export async function getCourse(slug: string) {
  const response = await apiRequest<{ data: RemoteCourse }>(
    `/courses/${encodeURIComponent(slug)}`,
  );
  return toCourse(response.data);
}
